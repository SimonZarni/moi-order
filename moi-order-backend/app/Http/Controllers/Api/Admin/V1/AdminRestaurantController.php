<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminRestaurantRequest;
use App\Http\Requests\Admin\UpdateAdminRestaurantRequest;
use App\Http\Resources\RestaurantResource;
use App\Models\Restaurant;
use App\Models\User;
use App\Services\RestaurantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * SRP — HTTP layer only. Admin restaurant management (CRUD + status).
 * DIP — depends on RestaurantService + FileStorageInterface, never on concrete implementations.
 */
class AdminRestaurantController extends Controller
{
    public function __construct(
        private readonly RestaurantService    $restaurantService,
        private readonly FileStorageInterface $storage,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = Restaurant::with(['merchant'])
            ->withCount(['foodOrders', 'menuItems'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $restaurants = $query->paginate($request->integer('per_page', 20));

        return response()->json([
            'data' => collect($restaurants->items())->map(fn (Restaurant $r) => [
                'id'                    => $r->id,
                'name'                  => $r->name,
                'address'               => $r->address,
                'phone'                 => $r->phone,
                'status'                => $r->status->value,
                'is_delivery_available' => $r->is_delivery_available,
                'is_pickup_available'   => $r->is_pickup_available,
                'min_order_cents'       => $r->min_order_cents,
                'delivery_radius_km'    => $r->delivery_radius_km,
                'food_orders_count'     => $r->food_orders_count,
                'menu_items_count'      => $r->menu_items_count,
                'merchant'              => [
                    'id'    => $r->merchant->id,
                    'name'  => $r->merchant->name,
                    'email' => $r->merchant->email,
                ],
                'created_at'            => $r->created_at?->toIso8601String(),
            ]),
            'meta' => [
                'current_page' => $restaurants->currentPage(),
                'last_page'    => $restaurants->lastPage(),
                'per_page'     => $restaurants->perPage(),
                'total'        => $restaurants->total(),
            ],
        ]);
    }

    public function show(Restaurant $restaurant): JsonResponse
    {
        $restaurant->load(['merchant', 'openingHours', 'menuCategories.menuItems']);

        return response()->json([
            'data' => (new RestaurantResource($restaurant, $this->storage))->resolve(request()),
        ]);
    }

    public function store(StoreAdminRestaurantRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::findOrFail($data['user_id']);
        $user->update(['is_merchant' => true]);

        $restaurant = $this->restaurantService->create($user, $data);

        return response()->json([
            'data' => (new RestaurantResource($restaurant, $this->storage))->resolve($request),
        ], 201);
    }

    public function update(UpdateAdminRestaurantRequest $request, Restaurant $restaurant): JsonResponse
    {
        $restaurant = $this->restaurantService->update($restaurant, $request->validated());

        return response()->json([
            'data' => (new RestaurantResource($restaurant, $this->storage))->resolve($request),
        ]);
    }

    public function destroy(Restaurant $restaurant): JsonResponse
    {
        $restaurant->delete();

        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, Restaurant $restaurant): JsonResponse
    {
        $request->validate(['status' => ['required', 'string', 'in:open,closed,paused']]);

        match ($request->string('status')->toString()) {
            'open'   => $restaurant->open(),
            'closed' => $restaurant->close(),
            'paused' => $restaurant->pause(),
        };

        return response()->json([
            'data' => ['id' => $restaurant->id, 'status' => $restaurant->status->value],
        ]);
    }
}
