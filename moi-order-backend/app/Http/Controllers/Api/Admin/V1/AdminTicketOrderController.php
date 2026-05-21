<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Exports\TicketOrderExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadEticketRequest;
use App\Http\Resources\TicketOrderResource;
use App\Models\TicketOrder;
use App\Models\TicketOrderItem;
use App\Notifications\PaymentReadyNotification;
use App\Services\TicketOrderService;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Principle: SRP — HTTP layer only. Admin ticket order management. ≤20 lines/action.
 */
class AdminTicketOrderController extends Controller
{
    public function __construct(
        private readonly TicketOrderService $service,
    ) {}

    /** GET /api/admin/v1/ticket-orders/stats */
    public function stats(): JsonResponse
    {
        $counts = TicketOrder::selectRaw('status, COUNT(*) as qty')
            ->groupBy('status')
            ->pluck('qty', 'status');

        $amountByStatus = TicketOrderItem::selectRaw(
            'ticket_orders.status, SUM(ticket_order_items.price_snapshot * ticket_order_items.quantity) as total_thb'
        )
            ->join('ticket_orders', 'ticket_orders.id', '=', 'ticket_order_items.ticket_order_id')
            ->whereIn('ticket_orders.status', ['processing', 'completed'])
            ->groupBy('ticket_orders.status')
            ->pluck('total_thb', 'status');

        return response()->json([
            'data' => [
                'total'         => $counts->sum(),
                'pending'       => (int) ($counts->get('pending_payment', 0) + $counts->get('cancelled', 0)),
                'processing'    => ['qty' => (int) $counts->get('processing', 0),  'amount' => (int) ($amountByStatus->get('processing', 0))],
                'completed'     => ['qty' => (int) $counts->get('completed', 0),   'amount' => (int) ($amountByStatus->get('completed', 0))],
                'failed'        => (int) $counts->get('payment_failed', 0),
            ],
        ]);
    }

    /** GET /api/admin/v1/ticket-orders/export */
    public function export(Request $request): BinaryFileResponse
    {
        return Excel::download(
            new TicketOrderExport($request->only(['status', 'search'])),
            'ticket-orders-' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    public function index(Request $request): JsonResponse
    {
        $query = TicketOrder::with(['ticket', 'user', 'items'])
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

    /** POST /api/admin/v1/ticket-orders/{ticketOrder}/confirm-payment */
    public function confirmPayment(TicketOrder $ticketOrder): JsonResponse
    {
        abort_if($ticketOrder->payment_authorized, 409, 'Order is already authorized for payment.');

        $ticketOrder->update(['payment_authorized' => true]);

        $ticketOrder->loadMissing(['ticket', 'user']);

        if ($ticketOrder->user) {
            $ticketOrder->user->notify(new PaymentReadyNotification(
                orderType: 'ticket_order',
                orderId:   $ticketOrder->id,
                orderName: $ticketOrder->ticket?->name ?? 'Ticket Order #'.$ticketOrder->id,
            ));
        }

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
