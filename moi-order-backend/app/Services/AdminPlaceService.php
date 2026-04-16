<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\AdminStorePlaceDTO;
use App\DTOs\AdminUpdatePlaceDTO;
use App\Http\Requests\Admin\AdminPlaceIndexRequest;
use App\Http\Requests\Admin\AdminReorderPlaceImagesRequest;
use App\Http\Requests\Admin\AdminUploadPlaceImagesRequest;
use App\Models\Place;
use App\Models\PlaceImage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns admin CRUD for places + image management.
 * Principle: DIP — receives FileStorageInterface via constructor; never calls Storage directly.
 */
class AdminPlaceService
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    public function index(AdminPlaceIndexRequest $request): LengthAwarePaginator
    {
        $query = Place::withTrashed()
            ->with(['category', 'coverImage'])
            ->latest();

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('city')) {
            $query->where('city', $request->string('city')->toString());
        }

        if ($request->filled('search')) {
            $term = $request->string('search')->toString();
            $query->where(function ($q) use ($term): void {
                $q->where('name_en', 'like', "%{$term}%")
                    ->orWhere('name_my', 'like', "%{$term}%")
                    ->orWhere('city', 'like', "%{$term}%");
            });
        }

        return $query->paginate($request->integer('per_page', 20));
    }

    public function show(Place $place): Place
    {
        return $place->load(['category', 'images', 'tags']);
    }

    public function store(AdminStorePlaceDTO $dto): Place
    {
        return DB::transaction(function () use ($dto): Place {
            $place = Place::create([
                'category_id'       => $dto->categoryId,
                'name_my'           => $dto->nameMy,
                'name_en'           => $dto->nameEn,
                'name_th'           => $dto->nameTh,
                'short_description' => $dto->shortDescription,
                'long_description'  => $dto->longDescription,
                'address'           => $dto->address,
                'city'              => $dto->city,
                'latitude'          => $dto->latitude,
                'longitude'         => $dto->longitude,
                'opening_hours'     => $dto->openingHours,
                'contact_phone'     => $dto->contactPhone,
                'website'           => $dto->website,
                'google_map_url'    => $dto->googleMapUrl,
            ]);

            if (! empty($dto->tagIds)) {
                $place->tags()->sync($dto->tagIds);
            }

            return $place->load(['category', 'tags']);
        });
    }

    public function update(Place $place, AdminUpdatePlaceDTO $dto): Place
    {
        return DB::transaction(function () use ($place, $dto): Place {
            $fields = array_filter([
                'category_id'       => $dto->categoryId,
                'name_my'           => $dto->nameMy,
                'name_en'           => $dto->nameEn,
                'name_th'           => $dto->nameTh,
                'short_description' => $dto->shortDescription,
                'long_description'  => $dto->longDescription,
                'address'           => $dto->address,
                'city'              => $dto->city,
                'latitude'          => $dto->latitude,
                'longitude'         => $dto->longitude,
                'opening_hours'     => $dto->openingHours,
                'contact_phone'     => $dto->contactPhone,
                'website'           => $dto->website,
                'google_map_url'    => $dto->googleMapUrl,
            ], fn ($v) => $v !== null);

            if (! empty($fields)) {
                $place->update($fields);
            }

            if ($dto->tagIds !== null) {
                $place->tags()->sync($dto->tagIds);
            }

            return $place->fresh()->load(['category', 'images', 'tags']);
        });
    }

    public function destroy(Place $place): void
    {
        $place->delete();
    }

    /** Upload images and append to the gallery. */
    public function uploadImages(Place $place, AdminUploadPlaceImagesRequest $request): Collection
    {
        $nextOrder = $place->images()->max('sort_order') ?? -1;

        return collect($request->file('images'))->map(function (UploadedFile $file) use ($place, &$nextOrder): PlaceImage {
            $nextOrder++;
            $path = $this->storage->store($file, "places/{$place->id}");

            return $place->images()->create([
                'path'       => $path,
                'sort_order' => $nextOrder,
            ]);
        });
    }

    public function deleteImage(PlaceImage $image): void
    {
        $this->storage->delete($image->path);
        $image->delete();
    }

    public function reorderImages(Place $place, AdminReorderPlaceImagesRequest $request): Collection
    {
        $updates = collect($request->input('images'));

        DB::transaction(function () use ($updates): void {
            foreach ($updates as $item) {
                PlaceImage::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
            }
        });

        return $place->images()->orderBy('sort_order')->get();
    }
}
