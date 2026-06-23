<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\Enums\RestaurantPlatformStatus;
use App\Enums\RestaurantStatus;
use App\Exceptions\DomainException;
use App\Models\Restaurant;
use App\Models\RestaurantOpeningHour;
use App\Models\RestaurantPhoto;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — restaurant CRUD + opening-hours management only.
 * Principle: DIP — depends on FileStorageInterface and MenuService interfaces, never calls Storage::disk() directly.
 */
class RestaurantService
{
    public function __construct(
        private readonly FileStorageInterface $storage,
        private readonly MenuService          $menuService,
    ) {}

    public function getForMerchant(User $merchant): ?Restaurant
    {
        return $merchant->restaurant()->with([
            'openingHours' => fn ($q) => $q->withCount('sessionMenuCategories'),
            'photos',
            'menuCategories.menuItems',
        ])->first();
    }

    /** @param array<string, mixed> $data */
    public function create(User $merchant, array $data): Restaurant
    {
        return DB::transaction(function () use ($merchant, $data): Restaurant {
            $coverPath = $this->storePhoto($data['cover_photo'] ?? null, 'restaurants/covers');
            $logoPath  = $this->storePhoto($data['logo'] ?? null, 'restaurants/logos');

            $restaurant = Restaurant::create([
                'user_id'               => $merchant->id,
                'name'                  => $data['name'],
                'description'           => $data['description'] ?? null,
                'address'               => $data['address'] ?? null,
                'latitude'              => $data['latitude'] ?? null,
                'longitude'             => $data['longitude'] ?? null,
                'phone'                 => $data['phone'] ?? null,
                'cover_photo_path'      => $coverPath,
                'logo_path'             => $logoPath,
                'status'                => isset($data['status']) ? RestaurantStatus::from($data['status']) : RestaurantStatus::Closed,
                'delivery_radius_km'    => $data['delivery_radius_km'] ?? null,
                'is_delivery_available' => $data['is_delivery_available'] ?? true,
                'is_pickup_available'   => $data['is_pickup_available'] ?? true,
                'min_order_cents'       => $data['min_order_cents'] ?? 0,
            ]);

            if (! empty($data['opening_hours'])) {
                $this->syncOpeningHours($restaurant, $data['opening_hours']);
            }

            $this->menuService->createSystemCategoriesForRestaurant($restaurant);

            return $restaurant->load(['openingHours', 'photos', 'menuCategories.menuItems']);
        });
    }

    /** @param array<string, mixed> $data */
    public function update(Restaurant $restaurant, array $data): Restaurant
    {
        return DB::transaction(function () use ($restaurant, $data): Restaurant {
            $updates = array_filter([
                'name'                  => $data['name'] ?? null,
                'description'           => $data['description'] ?? null,
                'address'               => $data['address'] ?? null,
                'latitude'              => $data['latitude'] ?? null,
                'longitude'             => $data['longitude'] ?? null,
                'phone'                 => $data['phone'] ?? null,
                'status'                => isset($data['status']) ? RestaurantStatus::from($data['status']) : null,
                'delivery_radius_km'    => $data['delivery_radius_km'] ?? null,
                'is_delivery_available' => $data['is_delivery_available'] ?? null,
                'is_pickup_available'   => $data['is_pickup_available'] ?? null,
                'min_order_cents'       => $data['min_order_cents'] ?? null,
            ], fn ($v) => $v !== null);

            if (($updates['status'] ?? null) === RestaurantStatus::Open) {
                $this->menuService->validateOpenReady($restaurant);
            }

            // Handle photo replacements
            if (isset($data['cover_photo'])) {
                if ($restaurant->cover_photo_path !== null) {
                    $this->storage->delete($restaurant->cover_photo_path);
                }
                $updates['cover_photo_path'] = $this->storePhoto($data['cover_photo'], 'restaurants/covers');
            }
            if (isset($data['logo'])) {
                if ($restaurant->logo_path !== null) {
                    $this->storage->delete($restaurant->logo_path);
                }
                $updates['logo_path'] = $this->storePhoto($data['logo'], 'restaurants/logos');
            }

            $restaurant->update($updates);

            if (isset($data['opening_hours'])) {
                $this->syncOpeningHours($restaurant, $data['opening_hours']);
            }

            return $restaurant->fresh(['openingHours', 'photos', 'menuCategories.menuItems']);
        });
    }

    /**
     * Merchant manual 3-hour status override.
     * Validates open-readiness before allowing Open; then arms override_until.
     * The scheduler (AutoOpenCloseRestaurants) skips this restaurant until expiry.
     */
    public function setStatusOverride(Restaurant $restaurant, RestaurantStatus $status): Restaurant
    {
        if ($status === RestaurantStatus::Open) {
            $this->menuService->validateOpenReady($restaurant);
        }

        $restaurant->overrideStatus($status);

        return $restaurant->fresh(['openingHours', 'photos', 'menuCategories.menuItems']);
    }

    public const MAX_GALLERY_PHOTOS = 8;

    public function addPhoto(Restaurant $restaurant, UploadedFile $file): RestaurantPhoto
    {
        if ($restaurant->photos()->count() >= self::MAX_GALLERY_PHOTOS) {
            throw new DomainException('restaurant.gallery_limit_reached', 422);
        }

        $path  = $this->storage->store($file, 'restaurants/gallery');
        $order = RestaurantPhoto::where('restaurant_id', $restaurant->id)->max('sort_order') ?? 0;

        return RestaurantPhoto::create([
            'restaurant_id' => $restaurant->id,
            'file_path'     => $path,
            'sort_order'    => $order + 1,
        ]);
    }

    public function deletePhoto(RestaurantPhoto $photo): void
    {
        DB::transaction(function () use ($photo): void {
            $this->storage->delete($photo->file_path);
            $photo->delete();
        });
    }

    /**
     * Reorders the restaurant's gallery photos according to the given id order.
     * Unknown ids (not belonging to this restaurant) are ignored.
     *
     * @param list<int> $orderedIds
     */
    public function reorderPhotos(Restaurant $restaurant, array $orderedIds): void
    {
        DB::transaction(function () use ($restaurant, $orderedIds): void {
            $photos = RestaurantPhoto::where('restaurant_id', $restaurant->id)
                ->whereIn('id', $orderedIds)
                ->get()
                ->keyBy('id');

            foreach (array_values($orderedIds) as $index => $id) {
                $photos->get($id)?->update(['sort_order' => $index + 1]);
            }
        });
    }

    /**
     * Browse active restaurants for customers, paginated.
     * When lat/lng provided: computes distance_km and is_within_range (null = no GPS on restaurant).
     * Sort: open+in-range → open+out-of-range → open+no-GPS → closed+in-range → ... → closed+no-GPS.
     * All restaurants are returned — none hidden by radius.
     */
    public function browse(?float $lat = null, ?float $lng = null, ?string $search = null): LengthAwarePaginator
    {
        $hasLocation = $lat !== null && $lng !== null;

        $query = Restaurant::where('platform_status', RestaurantPlatformStatus::Active->value)
            ->whereIn('status', [RestaurantStatus::Open->value, RestaurantStatus::Closed->value])
            ->with(['openingHours']);

        if ($hasLocation) {
            // Haversine formula gives distance in km. LEAST(1.0) guards against floating-point rounding
            // errors that would cause acos to receive a value slightly above 1, producing NaN.
            $haversine = '(6371 * acos(LEAST(1.0, cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))))';

            // is_within_range: NULL when restaurant has no coordinates, 1 inside radius, 0 outside.
            // Falls back to 5 km when delivery_radius_km is not set on the restaurant.
            $isWithinRange = "CASE WHEN latitude IS NULL OR longitude IS NULL THEN NULL WHEN {$haversine} <= COALESCE(delivery_radius_km, 5) THEN 1 ELSE 0 END";

            $query->selectRaw(
                "restaurants.*, ROUND({$haversine}, 2) AS distance_km, {$isWithinRange} AS is_within_range",
                [$lat, $lng, $lat, $lat, $lng, $lat],
            );

            $query
                ->orderByRaw('FIELD(status, ?, ?) ASC', [RestaurantStatus::Open->value, RestaurantStatus::Closed->value])
                ->orderByRaw('CASE WHEN is_within_range IS NULL THEN 2 WHEN is_within_range = 1 THEN 0 ELSE 1 END ASC')
                ->orderByRaw('distance_km ASC');
        } else {
            $query
                ->selectRaw('restaurants.*, NULL AS distance_km, NULL AS is_within_range')
                ->orderByRaw('FIELD(status, ?, ?) ASC', [RestaurantStatus::Open->value, RestaurantStatus::Closed->value])
                ->latest('restaurants.created_at');
        }

        if ($search !== null) {
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('menuCategories.menuItems', fn ($mi) =>
                      $mi->where('name', 'like', "%{$search}%")
                  );
            });
        }

        return $query->paginate(20);
    }

    /**
     * @param list<array{day_of_week: int, is_closed: bool, sessions: list<array{opens_at: string, closes_at: string}>}> $hours
     */
    /**
     * Upserts opening hours by (restaurant_id, day_of_week, sort_order) so that
     * existing row IDs are preserved. Removing a session slot deletes its row,
     * which cascades to any session-specific menu categories for that slot.
     */
    private function syncOpeningHours(Restaurant $restaurant, array $hours): void
    {
        foreach ($hours as $dayData) {
            $dayOfWeek = (int) $dayData['day_of_week'];
            $isClosed  = (bool) ($dayData['is_closed'] ?? false);
            $sessions  = $dayData['sessions'] ?? [];

            if ($isClosed) {
                RestaurantOpeningHour::updateOrCreate(
                    ['restaurant_id' => $restaurant->id, 'day_of_week' => $dayOfWeek, 'sort_order' => 0],
                    ['opens_at' => null, 'closes_at' => null, 'is_closed' => true],
                );
                // Remove any extra slots (e.g., previously had multiple sessions).
                RestaurantOpeningHour::where('restaurant_id', $restaurant->id)
                    ->where('day_of_week', $dayOfWeek)
                    ->where('sort_order', '>', 0)
                    ->delete();
            } else {
                foreach ($sessions as $index => $session) {
                    RestaurantOpeningHour::updateOrCreate(
                        ['restaurant_id' => $restaurant->id, 'day_of_week' => $dayOfWeek, 'sort_order' => $index],
                        ['opens_at' => $session['opens_at'], 'closes_at' => $session['closes_at'], 'is_closed' => false],
                    );
                }
                // Remove slots that are no longer in the submitted list.
                RestaurantOpeningHour::where('restaurant_id', $restaurant->id)
                    ->where('day_of_week', $dayOfWeek)
                    ->where('sort_order', '>=', count($sessions))
                    ->delete();
            }
        }
    }

    private function storePhoto(?UploadedFile $file, string $directory): ?string
    {
        if ($file === null) {
            return null;
        }

        return $this->storage->store($file, $directory);
    }
}
