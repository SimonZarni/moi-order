<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use App\Models\RestaurantDailyInvoice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — transforms RestaurantDailyInvoice into the client-facing shape.
 * Principle: DIP — FileStorageInterface injected; never calls Storage::disk() directly.
 *
 * is_provisional: true when the model is unsaved (today's live calculation).
 * payment_qr_url: signed 30-min URL returned only when restaurant is loaded and has a QR.
 */
class DailyInvoiceResource extends JsonResource
{
    public function __construct(
        RestaurantDailyInvoice $resource,
        private readonly ?FileStorageInterface $storage = null,
    ) {
        parent::__construct($resource);
    }

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        /** @var RestaurantDailyInvoice $invoice */
        $invoice = $this->resource;

        return [
            'id'                    => $invoice->exists ? $invoice->id : null,
            'date'                  => $invoice->date?->toDateString(),
            'order_count'           => $invoice->order_count,
            'customer_total_cents'  => $invoice->customer_total_cents,
            'platform_fee_cents'    => $invoice->platform_fee_cents,
            'payout_cents'          => $invoice->payout_cents,
            'status'                => $invoice->exists ? $invoice->status->value : 'pending',
            'status_label'          => $invoice->exists ? $invoice->status->label() : 'Pending',
            'is_provisional'        => !$invoice->exists,
            'paid_at'               => $invoice->paid_at?->toIso8601String(),
            'confirmed_by_id'       => $invoice->confirmed_by_id,
            'created_at'            => $invoice->exists ? $invoice->created_at?->toIso8601String() : null,

            'restaurant'            => $this->whenLoaded('restaurant', function () use ($invoice): array {
                $restaurant = $invoice->restaurant;
                $qrUrl = null;
                if ($this->storage !== null && $restaurant->payment_qr_path !== null) {
                    $qrUrl = $this->storage->url($restaurant->payment_qr_path);
                }
                return [
                    'id'              => $restaurant->id,
                    'name'            => $restaurant->name,
                    'payment_qr_url'  => $qrUrl,
                    'has_payment_qr'  => $restaurant->payment_qr_path !== null,
                ];
            }),
        ];
    }
}
