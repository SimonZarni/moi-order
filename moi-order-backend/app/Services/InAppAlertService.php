<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\InAppAlertDTO;
use App\Enums\AppAlertFrequency;
use App\Models\InAppAlert;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * SRP: owns all InAppAlert business logic.
 * Rule: at most 1 active alert per frequency slot — enforced in every write path
 *       inside a DB::transaction() so the deactivation and activation are atomic.
 * DIP: depends on FileStorageInterface (never Storage::disk() directly).
 */
class InAppAlertService
{
    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    public function store(InAppAlertDTO $dto, int $createdBy): InAppAlert
    {
        return DB::transaction(function () use ($dto, $createdBy): InAppAlert {
            if ($dto->isActive) {
                $this->deactivateSlot($dto->frequency);
            }

            return InAppAlert::create([
                'title'      => $dto->title,
                'message'    => $dto->message,
                'frequency'  => $dto->frequency->value,
                'is_active'  => $dto->isActive,
                'created_by' => $createdBy,
            ]);
        });
    }

    public function update(InAppAlert $alert, InAppAlertDTO $dto): InAppAlert
    {
        return DB::transaction(function () use ($alert, $dto): InAppAlert {
            // Activating OR changing frequency while active → evict the other slot holder.
            if ($dto->isActive) {
                $this->deactivateSlot($dto->frequency, excludeId: $alert->id);
            }

            $alert->update([
                'title'     => $dto->title,
                'message'   => $dto->message,
                'frequency' => $dto->frequency->value,
                'is_active' => $dto->isActive,
            ]);

            return $alert->fresh();
        });
    }

    public function activate(InAppAlert $alert): InAppAlert
    {
        return DB::transaction(function () use ($alert): InAppAlert {
            $this->deactivateSlot($alert->frequency, excludeId: $alert->id);
            $alert->update(['is_active' => true]);
            return $alert->fresh();
        });
    }

    public function deactivate(InAppAlert $alert): InAppAlert
    {
        $alert->update(['is_active' => false]);
        return $alert->fresh();
    }

    public function uploadImage(InAppAlert $alert, UploadedFile $file): InAppAlert
    {
        if ($alert->image_path) {
            $this->storage->delete($alert->image_path);
        }

        $path = $this->storage->store($file, 'in-app-alerts');
        $alert->update(['image_path' => $path]);

        return $alert->fresh();
    }

    public function removeImage(InAppAlert $alert): InAppAlert
    {
        if ($alert->image_path) {
            $this->storage->delete($alert->image_path);
            $alert->update(['image_path' => null]);
        }

        return $alert->fresh();
    }

    public function delete(InAppAlert $alert): void
    {
        if ($alert->image_path) {
            $this->storage->delete($alert->image_path);
        }

        $alert->delete();
    }

    private function deactivateSlot(AppAlertFrequency $frequency, ?int $excludeId = null): void
    {
        InAppAlert::where('frequency', $frequency->value)
            ->where('is_active', true)
            ->when($excludeId !== null, fn ($q) => $q->where('id', '!=', $excludeId))
            ->update(['is_active' => false]);
    }
}
