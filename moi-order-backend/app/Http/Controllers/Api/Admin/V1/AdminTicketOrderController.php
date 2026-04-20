<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadEticketRequest;
use App\Http\Resources\TicketOrderResource;
use App\Models\TicketOrder;
use App\Services\TicketOrderService;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Principle: SRP — HTTP layer only. Admin ticket order management. ≤20 lines/action.
 */
class AdminTicketOrderController extends Controller
{
    public function __construct(
        private readonly TicketOrderService $service,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = TicketOrder::with(['ticket', 'user'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($q) use ($search): void {
                $q->whereHas('ticket', fn ($tq) => $tq->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%")
                                                       ->orWhere('email', 'like', "%{$search}%"));
            });
        }

        $orders = $query->paginate($request->integer('per_page', 20));

        return response()->json([
            'data' => TicketOrderResource::collection($orders->items()),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    public function show(TicketOrder $ticketOrder): JsonResponse
    {
        $ticketOrder->load(['ticket', 'items.variant', 'user', 'payment']);

        return response()->json(['data' => new TicketOrderResource($ticketOrder)]);
    }

    /** POST /api/admin/v1/ticket-orders/{ticketOrder}/eticket */
    public function uploadEticket(UploadEticketRequest $request, TicketOrder $ticketOrder): JsonResponse
    {
        $order = $this->service->uploadEticket($ticketOrder, $request->file('eticket'));

        return response()->json(['data' => new TicketOrderResource($order)]);
    }

    /**
     * GET /api/admin/v1/ticket-orders/{ticketOrder}/eticket
     * Streams the file directly — no signed URL, no APP_URL dependency.
     */
    public function downloadEticket(TicketOrder $ticketOrder): StreamedResponse
    {
        abort_if($ticketOrder->eticket_path === null, 404, 'No e-ticket uploaded for this order.');

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk(config('filesystems.default', 'local'));

        abort_if(! $disk->exists($ticketOrder->eticket_path), 404, 'E-ticket file not found. It may have been lost after a server restart.');

        $isPdf    = str_ends_with(strtolower($ticketOrder->eticket_path), '.pdf');
        $mimeType = $isPdf ? 'application/pdf' : 'image/jpeg';
        $filename = 'eticket-'.$ticketOrder->id.($isPdf ? '.pdf' : '.jpg');

        return $disk->response($ticketOrder->eticket_path, $filename, [
            'Content-Type'        => $mimeType,
            'Content-Disposition' => 'inline; filename="'.$filename.'"',
        ]);
    }
}
