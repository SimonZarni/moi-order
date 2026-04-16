<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Contracts\FileStorageInterface;
use App\Enums\TicketOrderStatus;
use App\Http\Controllers\Controller;
use App\Models\TicketOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — generates e-ticket download URL only.
 * Security: signed URL with 30-min TTL; only available once order is completed.
 *   Query scoped to authenticated user — no cross-user access.
 */
class TicketOrderEticketController extends Controller
{
    public function __construct(
        private readonly FileStorageInterface $fileStorage,
    ) {}

    /** GET /api/v1/ticket-orders/{id}/eticket */
    public function show(int $id, Request $request): JsonResponse
    {
        $order = TicketOrder::forUser($request->user()->id)->findOrFail($id);

        abort_if(
            $order->status !== TicketOrderStatus::Completed || $order->eticket_path === null,
            409,
            'E-ticket is not yet available for this order.',
        );

        $url = $this->fileStorage->url($order->eticket_path, 30);

        return response()->json(['data' => ['url' => $url]]);
    }
}
