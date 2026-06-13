<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminRestaurantRequest;
use App\Http\Requests\Admin\UpdateAdminRestaurantRequest;
use App\Http\Requests\Admin\UpdateRestaurantPlatformStatusRequest;
use App\Http\Resources\RestaurantResource;
use App\Models\Restaurant;
use App\Models\RestaurantPhoto;
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
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhereHas('menuCategories.menuItems', fn ($mi) => $mi->where('name', 'like', "%{$search}%"));
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
                'platform_status'       => $r->platform_status->value,
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
        $restaurant->load(['merchant', 'openingHours', 'photos', 'menuCategories.menuItems']);

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
        $restaurant->load('merchant');

        return response()->json([
            'data' => (new RestaurantResource($restaurant, $this->storage))->resolve($request),
        ], 201);
    }

    public function update(UpdateAdminRestaurantRequest $request, Restaurant $restaurant): JsonResponse
    {
        $restaurant = $this->restaurantService->update($restaurant, $request->validated());
        $restaurant->load('merchant');

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

        // Admin can force merchant status without the menu-rule check.
        match ($request->string('status')->toString()) {
            'open'   => $restaurant->markAsOpen(),
            'closed' => $restaurant->markAsClosed(),
            'paused' => $restaurant->markAsPaused(),
        };

        return response()->json([
            'data' => ['id' => $restaurant->id, 'status' => $restaurant->status->value],
        ]);
    }

    public function updatePlatformStatus(UpdateRestaurantPlatformStatusRequest $request, Restaurant $restaurant): JsonResponse
    {
        match ($request->enum('platform_status', \App\Enums\RestaurantPlatformStatus::class)) {
            \App\Enums\RestaurantPlatformStatus::Active    => $restaurant->activate(),
            \App\Enums\RestaurantPlatformStatus::Suspended => $restaurant->suspend(),
        };

        return response()->json([
            'data' => ['id' => $restaurant->id, 'platform_status' => $restaurant->platform_status->value],
        ]);
    }

    /** POST /api/admin/v1/restaurants/{restaurant}/photos */
    public function uploadPhoto(Request $request, Restaurant $restaurant): JsonResponse
    {
        // 'image' rule uses getimagesize() which does not support HEIC/HEIF — omitted intentionally.
        $request->validate(['photo' => ['required', 'file', 'mimes:jpeg,jpg,png,webp,heic,heif', 'max:5120']]);
        $this->restaurantService->addPhoto($restaurant, $request->file('photo'));
        return response()->json([
            'data' => (new RestaurantResource($restaurant->fresh(['photos']), $this->storage))->resolve($request),
        ], 201);
    }

    /** DELETE /api/admin/v1/restaurants/{restaurant}/photos/{photoId} */
    public function removePhoto(Request $request, Restaurant $restaurant, int $photoId): JsonResponse
    {
        $photo = RestaurantPhoto::where('restaurant_id', $restaurant->id)->findOrFail($photoId);
        $this->restaurantService->deletePhoto($photo);
        return response()->json([
            'data' => (new RestaurantResource($restaurant->fresh(['photos']), $this->storage))->resolve($request),
        ]);
    }

    /** PATCH /api/admin/v1/restaurants/{restaurant}/photos/reorder */
    public function reorderPhotos(Request $request, Restaurant $restaurant): JsonResponse
    {
        $validated = $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);
        $this->restaurantService->reorderPhotos($restaurant, $validated['ids']);
        return response()->json([
            'data' => (new RestaurantResource($restaurant->fresh(['photos']), $this->storage))->resolve($request),
        ]);
    }
}
