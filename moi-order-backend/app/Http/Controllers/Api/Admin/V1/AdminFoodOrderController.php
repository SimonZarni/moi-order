<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Enums\FoodOrderStatus;
use App\Events\FoodOrderStatusUpdated;
use App\Exports\FoodOrderExport;
use App\Http\Controllers\Controller;
use App\Http\Resources\FoodOrderResource;
use App\Models\FoodOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * SRP — HTTP layer only. Admin food order management.
 * DIP — depends on FileStorageInterface, never on concrete implementations.
 */
class AdminFoodOrderController extends Controller
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    public function index(Request $request): JsonResponse
    {
        $query = FoodOrder::with(['restaurant', 'user'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('restaurant_id')) {
            $query->where('restaurant_id', $request->integer('restaurant_id'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($q) use ($search): void {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($uq) =>
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%")
                  )->orWhereHas('restaurant', fn ($rq) =>
                      $rq->where('name', 'like', "%{$search}%")
                  );
            });
        }

        $orders = $query->paginate($request->integer('per_page', 20));

        return response()->json([
            'data' => collect($orders->items())->map(fn (FoodOrder $o) => [
                'id'               => $o->uuid,
                'order_number'     => $o->order_number,
                'status'           => $o->status->value,
                'status_label'     => $o->status->label(),
                'payment_method'   => $o->payment_method->value,
                'total_cents'      => $o->total_cents,
                'delivery_address' => $o->delivery_address,
                'restaurant'       => [
                    'id'   => $o->restaurant->id,
                    'name' => $o->restaurant->name,
                ],
                'user'             => [
                    'id'    => $o->user->uuid,
                    'name'  => $o->user->name,
                    'email' => $o->user->email,
                ],
                'confirmed_at'           => $o->confirmed_at?->toIso8601String(),
                'payment_confirmed_at'   => $o->payment_confirmed_at?->toIso8601String(),
                'completed_at'           => $o->completed_at?->toIso8601String(),
                'cancelled_at'           => $o->cancelled_at?->toIso8601String(),
                'created_at'             => $o->created_at?->toIso8601String(),
            ]),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    /** GET /api/admin/v1/food-orders/export */
    public function export(Request $request): BinaryFileResponse
    {
        return Excel::download(
            new FoodOrderExport($request->only(['status', 'restaurant_id', 'search'])),
            'food-orders-' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    public function show(FoodOrder $foodOrder): JsonResponse
    {
        $foodOrder->load(['restaurant', 'user', 'items']);

        // array_merge (not +) so the right-side overrides win for 'user'/'restaurant'.
        // PHP's + operator keeps the LEFT value for duplicate keys, causing email to be lost.
        return response()->json([
            'data' => array_merge(
                (new FoodOrderResource($foodOrder, $this->storage))->toArray(request()),
                [
                    'user' => [
                        'id'    => $foodOrder->user->uuid,
                        'name'  => $foodOrder->user->name,
                        'email' => $foodOrder->user->email,
                        'phone' => $foodOrder->user->phone_number,
                    ],
                    'restaurant' => [
                        'id'    => $foodOrder->restaurant->id,
                        'name'  => $foodOrder->restaurant->name,
                        'phone' => $foodOrder->restaurant->phone,
                    ],
                ]
            ),
        ]);
    }

    /** GET /api/admin/v1/food-orders/reviews — orders that have a customer rating */
    public function reviews(Request $request): JsonResponse
    {
        $query = FoodOrder::with(['restaurant', 'user'])
            ->whereNotNull('rating')
            ->orderByDesc('completed_at');

        if ($request->filled('restaurant_id')) {
            $query->where('restaurant_id', $request->integer('restaurant_id'));
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->integer('rating'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($q) use ($search): void {
                $q->whereHas('user', fn ($uq) =>
                    $uq->where('name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%")
                )->orWhereHas('restaurant', fn ($rq) =>
                    $rq->where('name', 'like', "%{$search}%")
                );
            });
        }

        $orders = $query->paginate($request->integer('per_page', 20));

        return response()->json([
            'data' => collect($orders->items())->map(fn (FoodOrder $o) => [
                'id'              => $o->uuid,
                'order_number'    => $o->order_number,
                'rating'          => $o->rating,
                'customer_review' => $o->customer_review,
                'restaurant'      => ['id' => $o->restaurant->id, 'name' => $o->restaurant->name],
                'user'            => ['id' => $o->user->uuid, 'name' => $o->user->name],
                'completed_at'    => $o->completed_at?->toIso8601String(),
            ]),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    public function confirmPayment(FoodOrder $foodOrder): JsonResponse
    {
        $foodOrder->load(['restaurant', 'user', 'items']);
        $foodOrder->transitionTo(FoodOrderStatus::PaymentConfirmed);
        event(new FoodOrderStatusUpdated($foodOrder->fresh()));

        $fresh = $foodOrder->fresh(['items', 'restaurant', 'user']);

        return response()->json([
            'data' => array_merge(
                (new FoodOrderResource($fresh, $this->storage))->toArray(request()),
                [
                    'user' => [
                        'id'    => $fresh->user->uuid,
                        'name'  => $fresh->user->name,
                        'email' => $fresh->user->email,
                        'phone' => $fresh->user->phone_number,
                    ],
                    'restaurant' => [
                        'id'    => $fresh->restaurant->id,
                        'name'  => $fresh->restaurant->name,
                        'phone' => $fresh->restaurant->phone,
                    ],
                ]
            ),
        ]);
    }
}
