<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Contracts\FileStorageInterface;
use App\Enums\TicketOrderStatus;
use App\Http\Controllers\Controller;
use App\Models\TicketOrder;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk(config('filesystems.default', 'local'));

        abort_if(! $disk->exists($order->eticket_path), 404, 'E-ticket file not found. Please contact support.');

        $url      = $this->fileStorage->url($order->eticket_path, 30);
        $isPdf    = str_ends_with(strtolower($order->eticket_path), '.pdf');
        $mimeType = $isPdf ? 'application/pdf' : 'image/jpeg';

        return response()->json(['data' => ['url' => $url, 'mime_type' => $mimeType]]);
    }
}
