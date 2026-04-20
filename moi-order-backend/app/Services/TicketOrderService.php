<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\CreateTicketOrderDTO;
use App\Enums\TicketOrderStatus;
use App\Models\Ticket;
use App\Models\TicketOrder;
use App\Models\TicketVariant;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — owns ticket order business logic only.
 * Principle: DIP — depends on FileStorageInterface; never on Storage::disk() directly.
 * Security: variant FK validated against the ticket ID with a lock — prevents cross-ticket abuse.
 *   price_snapshot captured at creation time — server computes totals, never trusts client.
 */
class TicketOrderService
{
    public function __construct(
        private readonly FileStorageInterface $fileStorage,
    ) {}

    public function create(CreateTicketOrderDTO $dto, User $user): TicketOrder
    {
        // Fast-path idempotency check — avoids entering the transaction on retries.
        $existing = TicketOrder::where('idempotency_key', $dto->idempotencyKey)
            ->where('user_id', $user->id)
            ->first();

        if ($existing !== null) {
            return $existing->load('items.variant', 'ticket');
        }

        try {
            return DB::transaction(function () use ($dto, $user): TicketOrder {
                $variantIds = array_column($dto->items, 'variantId');

                // Lock variants to snapshot prices and validate they belong to the ticket.
                $variants = TicketVariant::whereIn('id', $variantIds)
                    ->where('ticket_id', $dto->ticketId)
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                foreach ($dto->items as $item) {
                    if (! $variants->has($item->variantId)) {
                        throw new \DomainException('ticket.variant_unavailable');
                    }
                }

                $order = TicketOrder::create([
                    'user_id'         => $user->id,
                    'ticket_id'       => $dto->ticketId,
                    'visit_date'      => $dto->visitDate,
                    'status'          => TicketOrderStatus::PendingPayment,
                    'idempotency_key' => $dto->idempotencyKey,
                ]);

                foreach ($dto->items as $item) {
                    $variant = $variants->get($item->variantId);
                    $order->items()->create([
                        'ticket_variant_id' => $variant->id,
                        'quantity'          => $item->quantity,
                        'price_snapshot'    => $variant->price,
                    ]);
                }

                Log::info('ticket_order.created', ['order_id' => $order->id, 'user_id' => $user->id]);

                return $order->load('items.variant', 'ticket');
            });
        } catch (UniqueConstraintViolationException) {
            // A concurrent request with the same idempotency key beat us to the insert.
            // Return the order they created — this request is a safe duplicate.
            return TicketOrder::where('idempotency_key', $dto->idempotencyKey)
                ->where('user_id', $user->id)
                ->with('items.variant', 'ticket')
                ->firstOrFail();
        }
    }

    /**
     * Upload the PDF e-ticket and mark the order as completed.
     * Security: MIME whitelist re-checked in FileStorageService (defence in depth).
     */
    public function uploadEticket(TicketOrder $order, UploadedFile $file): TicketOrder
    {
        $path = $this->fileStorage->store($file, 'etickets', ['application/pdf', 'image/jpeg', 'image/png']);

        DB::transaction(function () use ($order, $path): void {
            $order->markCompleted($path);
        });

        Log::info('ticket_order.eticket_uploaded', ['order_id' => $order->id]);

        return $order->fresh();
    }
}
