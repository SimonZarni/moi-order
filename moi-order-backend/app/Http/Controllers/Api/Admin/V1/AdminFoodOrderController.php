<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Enums\FoodOrderStatus;
use App\Events\FoodOrderStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Resources\FoodOrderResource;
use App\Models\FoodOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
                'id'               => $o->id,
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
                    'id'    => $o->user->id,
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

    public function show(FoodOrder $foodOrder): JsonResponse
    {
        $foodOrder->load(['restaurant', 'user', 'items']);

        return response()->json([
            'data' => (new FoodOrderResource($foodOrder, $this->storage))->toArray(request()) + [
                'user' => [
                    'id'    => $foodOrder->user->id,
                    'name'  => $foodOrder->user->name,
                    'email' => $foodOrder->user->email,
                ],
                'restaurant' => [
                    'id'   => $foodOrder->restaurant->id,
                    'name' => $foodOrder->restaurant->name,
                ],
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
            'data' => (new FoodOrderResource($fresh, $this->storage))->toArray(request()) + [
                'user' => [
                    'id'    => $fresh->user->id,
                    'name'  => $fresh->user->name,
                    'email' => $fresh->user->email,
                ],
                'restaurant' => [
                    'id'   => $fresh->restaurant->id,
                    'name' => $fresh->restaurant->name,
                ],
            ],
        ]);
    }
}
