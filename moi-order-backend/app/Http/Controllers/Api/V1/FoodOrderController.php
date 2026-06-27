<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Contracts\FileStorageInterface;
use App\Contracts\LineMessagingInterface;
use App\DTOs\CompleteFoodOrderDTO;
use App\DTOs\StoreFoodOrderDTO;
use App\Exceptions\DomainException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CompleteFoodOrderRequest;
use App\Http\Requests\Api\StoreOrderReviewRequest;
use App\Http\Requests\Api\StoreFoodOrderRequest;
use App\Http\Requests\CancelFoodOrderRequest;
use App\Http\Requests\DeleteFoodOrderRequest;
use App\Http\Resources\FoodOrderResource;
use App\Enums\FoodOrderStatus;
use App\Enums\FoodPaymentMethod;
use App\Models\FoodOrder;
use App\Services\FoodOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FoodOrderController extends Controller
{
    public function __construct(
        private readonly FoodOrderService     $orderService,
        private readonly FileStorageInterface $storage,
        private readonly LineMessagingInterface $lineMessaging,
    ) {}

    /** GET /api/v1/food-orders */
    public function index(Request $request): JsonResponse
    {
        $orders = $this->orderService->listForUser($request->user()->id);

        return response()->json([
            'data' => collect($orders->items())
                ->map(fn ($o) => (new FoodOrderResource($o, $this->storage))->toArray($request))
                ->values(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    /** GET /api/v1/food-orders/active — all non-terminal orders for the auth user */
    public function active(Request $request): JsonResponse
    {
        $orders = FoodOrder::forUser($request->user()->id)
            ->with('restaurant')
            ->whereNotIn('status', [
                FoodOrderStatus::Completed->value,
                FoodOrderStatus::Cancelled->value,
                FoodOrderStatus::Expired->value,
            ])
            ->latest()
            ->get();

        return response()->json([
            'data' => $orders->map(fn ($o) => new FoodOrderResource($o, $this->storage))->values(),
        ]);
    }

    /** GET /api/v1/food-orders/{id} */
    public function show(Request $request, string $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)
            ->with(['items', 'restaurant', 'user'])
            ->where('uuid', $id)
            ->firstOrFail();

        return response()->json(['data' => new FoodOrderResource($order, $this->storage)]);
    }

    /** POST /api/v1/food-orders */
    public function store(StoreFoodOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->place(StoreFoodOrderDTO::fromRequest($request));

        return response()->json(['data' => new FoodOrderResource($order, $this->storage)], 201);
    }

    /** POST /api/v1/food-orders/{id}/cancel */
    public function cancel(CancelFoodOrderRequest $request, string $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();
        $order = $this->orderService->cancelByCustomer($order);

        return response()->json(['data' => new FoodOrderResource($order, $this->storage)]);
    }

    /** DELETE /api/v1/food-orders/{id} */
    public function destroy(DeleteFoodOrderRequest $request, string $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();
        $this->orderService->deleteCancelled($order);

        return response()->json(null, 204);
    }

    /** POST /api/v1/food-orders/{id}/notify-line-pay */
    public function notifyLinePay(Request $request, string $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)
            ->with(['items', 'restaurant', 'user'])
            ->where('uuid', $id)
            ->firstOrFail();

        if ($order->payment_method !== FoodPaymentMethod::LinePay) {
            throw new DomainException('order.not_line_pay', 409);
        }

        if (! $order->canShowPromptPay()) {
            throw new DomainException('order.not_awaiting_payment', 409);
        }

        \Illuminate\Support\Facades\Log::error('notifyLinePay called', [
            'order' => $order->order_number,
            'user'  => $order->user?->id,
            'line_id' => $order->user?->line_id ? 'set' : 'null',
        ]);

        // Always notify the admin group — customer LINE status must never block this.
        $this->lineMessaging->pushToAdmin($order->linePayNotificationText());

        // The customer will send the full order summary themselves via the pre-filled LINE URL.
        // No separate bot push to the customer — that would create a duplicate message.

        return response()->json(['pre_filled_message' => $order->linePayUserSendText()], 200);
    }

    /** POST /api/v1/food-orders/{id}/review */
    public function review(StoreOrderReviewRequest $request, string $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();

        $order = $this->orderService->saveReview(
            $order,
            (int) $request->validated('rating'),
            $request->validated('review'),
        );

        return response()->json(['data' => new FoodOrderResource($order, $this->storage)]);
    }

    /** POST /api/v1/food-orders/{id}/complete */
    public function complete(CompleteFoodOrderRequest $request, string $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();
        $dto   = CompleteFoodOrderDTO::fromRequest($request);

        $order = $this->orderService->completeByCustomer($order, $dto->rating, $dto->review);

        return response()->json(['data' => new FoodOrderResource($order, $this->storage)]);
    }
}
