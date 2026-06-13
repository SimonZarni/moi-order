<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\UpdateBusinessProfileDTO;
use App\Enums\KycApplicationStatus;
use App\Enums\KycDocumentType;
use App\Models\KycApplication;
use App\Models\KycDocument;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns the merchant business profile read + editable field updates.
 * Principle: DIP — delegates document upload to KycService (injected).
 * Principle: Security — all queries scoped to the authenticated user's ID.
 */
class BusinessProfileService
{
    public function __construct(
        private readonly KycService $kycService,
    ) {}

    /**
     * Return all data needed to render the Business Profile screen.
     *
     * @return array{user: User, kyc: KycApplication|null, restaurant: Restaurant|null}
     */
    public function getProfile(User $user): array
    {
        $kyc = KycApplication::forUser($user->id)
            ->where('status', KycApplicationStatus::Approved->value)
            ->with('documents')
            ->latest('reviewed_at')
            ->first();

        $restaurant = Restaurant::where('user_id', $user->id)->first();

        return ['user' => $user, 'kyc' => $kyc, 'restaurant' => $restaurant];
    }

    /**
     * Apply partial editable-field updates from the DTO.
     * Only fields flagged as present in the request are written.
     *
     * @return array{user: User, kyc: KycApplication|null, restaurant: Restaurant|null}
     */
    public function updateProfile(User $user, UpdateBusinessProfileDTO $dto): array
    {
        $app = KycApplication::forUser($user->id)
            ->where('status', KycApplicationStatus::Approved->value)
            ->latest('reviewed_at')
            ->firstOrFail();

        DB::transaction(function () use ($app, $dto, $user): void {
            if ($dto->hasBusinessPhone) {
                $app->update(['business_phone' => $dto->businessPhone]);
            }
            if ($dto->hasEmail && $dto->email !== null) {
                $user->update(['email' => $dto->email]);
            }
        });

        return $this->getProfile($user->fresh());
    }

    /**
     * Replace a document on the merchant's approved KYC application.
     */
    public function replaceDocument(User $user, UploadedFile $file, KycDocumentType $type): KycDocument
    {
        $app = KycApplication::forUser($user->id)
            ->where('status', KycApplicationStatus::Approved->value)
            ->latest('reviewed_at')
            ->firstOrFail();

        return $this->kycService->uploadDocument($app, $file, $type);
    }
}
