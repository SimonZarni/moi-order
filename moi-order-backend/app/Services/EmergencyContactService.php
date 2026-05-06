<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\StoreEmergencyContactDTO;
use App\DTOs\UpdateEmergencyContactDTO;
use App\Enums\EmergencyContactType;
use App\Models\EmergencyContact;
use App\Models\EmergencyContactPhoto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EmergencyContactService
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    // ── Public (user-facing) ──────────────────────────────────────────────────

    public function listByType(EmergencyContactType $type, int $perPage = 20): LengthAwarePaginator
    {
        return EmergencyContact::active()
            ->ofType($type)
            ->with(['coverPhoto'])
            ->orderBy('position')
            ->paginate($perPage);
    }

    public function showForUser(EmergencyContact $contact): EmergencyContact
    {
        return $contact->load(['photos']);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    public function indexForAdmin(int $perPage = 20): LengthAwarePaginator
    {
        return EmergencyContact::withTrashed()
            ->with(['coverPhoto'])
            ->orderBy('type')
            ->orderBy('position')
            ->paginate($perPage);
    }

    public function store(StoreEmergencyContactDTO $dto): EmergencyContact
    {
        $position = EmergencyContact::where('type', $dto->type->value)->max('position') + 1;

        return EmergencyContact::create([
            'type'           => $dto->type->value,
            'title_en'       => $dto->titleEn,
            'title_mm'       => $dto->titleMm,
            'title_th'       => $dto->titleTh,
            'description_en' => $dto->descriptionEn,
            'description_mm' => $dto->descriptionMm,
            'description_th' => $dto->descriptionTh,
            'phone'          => $dto->phone,
            'map_url'        => $dto->mapUrl,
            'latitude'       => $dto->latitude,
            'longitude'      => $dto->longitude,
            'location'       => $dto->location,
            'facebook_url'   => $dto->facebookUrl,
            'website_url'    => $dto->websiteUrl,
            'is_active'      => $dto->isActive,
            'position'       => $position,
        ]);
    }

    public function update(EmergencyContact $contact, UpdateEmergencyContactDTO $dto): EmergencyContact
    {
        $contact->update([
            'type'           => $dto->type->value,
            'title_en'       => $dto->titleEn,
            'title_mm'       => $dto->titleMm,
            'title_th'       => $dto->titleTh,
            'description_en' => $dto->descriptionEn,
            'description_mm' => $dto->descriptionMm,
            'description_th' => $dto->descriptionTh,
            'phone'          => $dto->phone,
            'map_url'        => $dto->mapUrl,
            'latitude'       => $dto->latitude,
            'longitude'      => $dto->longitude,
            'location'       => $dto->location,
            'facebook_url'   => $dto->facebookUrl,
            'website_url'    => $dto->websiteUrl,
            'is_active'      => $dto->isActive,
        ]);

        return $contact->fresh(['photos']);
    }

    public function destroy(EmergencyContact $contact): void
    {
        $contact->delete();
    }

    public function restore(EmergencyContact $contact): EmergencyContact
    {
        $contact->restore();
        return $contact->fresh();
    }

    // ── Photos ────────────────────────────────────────────────────────────────

    /** @param UploadedFile[] $files */
    public function uploadPhotos(EmergencyContact $contact, array $files): Collection
    {
        $nextPosition = $contact->photos()->max('position') + 1;

        return DB::transaction(function () use ($contact, $files, $nextPosition): Collection {
            $photos = collect();

            foreach ($files as $index => $file) {
                $path = $this->storage->store($file, 'emergency-contacts');

                $photos->push(EmergencyContactPhoto::create([
                    'emergency_contact_id' => $contact->id,
                    'path'                 => $path,
                    'is_cover'             => $nextPosition + $index === 1,
                    'position'             => $nextPosition + $index,
                ]));
            }

            return $photos;
        });
    }

    public function deletePhoto(EmergencyContactPhoto $photo): void
    {
        $photo->delete();
    }

    public function reorderPhotos(EmergencyContact $contact, array $orderedIds): Collection
    {
        DB::transaction(function () use ($contact, $orderedIds): void {
            EmergencyContactPhoto::where('emergency_contact_id', $contact->id)
                ->whereIn('id', $orderedIds)
                ->lockForUpdate()
                ->get();

            foreach ($orderedIds as $index => $id) {
                EmergencyContactPhoto::where('id', $id)
                    ->where('emergency_contact_id', $contact->id)
                    ->update([
                        'position' => $index + 1,
                        'is_cover' => $index === 0,
                    ]);
            }
        });

        return $contact->photos()->get();
    }
}
