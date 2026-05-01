<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\KycApplicationDTO;
use App\Enums\KycApplicationStatus;
use App\Enums\KycDocumentType;
use App\Events\KycApplicationApproved;
use App\Events\KycApplicationRejected;
use App\Events\KycApplicationSubmitted;
use App\Exceptions\DomainException;
use App\Models\KycApplication;
use App\Models\KycDocument;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns KYC application lifecycle only.
 * Principle: DIP — FileStorageInterface injected, never Storage::disk() directly.
 * Principle: Security — MIME validated server-side in this service (not just FormRequest).
 * Principle: Encapsulation — state transitions delegated to model domain methods.
 */
class KycService
{
    /** Allowed MIME types for KYC documents (images + PDF). */
    private const ALLOWED_DOCUMENT_MIMES = [
        'image/jpeg',
        'image/png',
        'application/pdf',
    ];

    private const KYC_STORAGE_DIRECTORY = 'kyc-documents';

    public function __construct(
        private readonly FileStorageInterface $fileStorage,
    ) {}

    /**
     * Return the user's latest non-terminal application, or create a new draft.
     * Principle: Information Expert — model knows its own state, service orchestrates.
     */
    public function getOrCreateApplication(User $user): KycApplication
    {
        /** @var KycApplication|null $existing */
        $existing = KycApplication::forUser($user->id)
            ->whereNotIn('status', [
                KycApplicationStatus::Approved->value,
                KycApplicationStatus::Rejected->value,
            ])
            ->latest()
            ->first();

        if ($existing !== null) {
            return $existing;
        }

        return KycApplication::create([
            'user_id'          => $user->id,
            'business_name'    => '',
            'business_type'    => '',
            'business_address' => '',
            'status'           => KycApplicationStatus::Draft,
        ]);
    }

    /**
     * Update the application's business info.
     * Principle: CQS — mutates, returns updated model.
     */
    public function updateApplication(KycApplication $app, KycApplicationDTO $dto): KycApplication
    {
        $app->update([
            'business_name'    => $dto->businessName,
            'business_type'    => $dto->businessType,
            'business_address' => $dto->businessAddress,
        ]);

        return $app->fresh();
    }

    /**
     * Upload (or replace) a KYC document of the given type.
     * Principle: Security — server-side MIME validation before storage.
     * Principle: Security — original filename never stored; UUID-named via FileStorageService.
     */
    public function uploadDocument(
        KycApplication $app,
        UploadedFile $file,
        KycDocumentType $type
    ): KycDocument {
        // Server-side MIME validation (FormRequest only checks extension).
        $mime = $file->getMimeType();
        if (! in_array($mime, self::ALLOWED_DOCUMENT_MIMES, strict: true)) {
            throw new DomainException('kyc.invalid_file_type', 422);
        }

        // Delete existing doc of this type (one-per-type constraint).
        KycDocument::where('kyc_application_id', $app->id)
            ->where('type', $type->value)
            ->each(function (KycDocument $doc): void {
                $this->fileStorage->delete($doc->file_path);
                $doc->delete();
            });

        $path = $this->fileStorage->store(
            $file,
            self::KYC_STORAGE_DIRECTORY,
            self::ALLOWED_DOCUMENT_MIMES,
        );

        return KycDocument::create([
            'kyc_application_id' => $app->id,
            'type'               => $type->value,
            'file_path'          => $path,
        ]);
    }

    /**
     * Submit the application for review.
     * Validates all four document types are present before transitioning.
     * Principle: DomainException — business rule violations are not 422.
     */
    public function submit(KycApplication $app): KycApplication
    {
        if ($app->status !== KycApplicationStatus::Draft) {
            throw new DomainException('kyc.already_submitted', 409);
        }

        if (! $app->hasAllRequiredDocuments()) {
            throw new DomainException('kyc.missing_required_documents', 409);
        }

        $app->submit();
        $app->load('documents');

        event(new KycApplicationSubmitted($app));

        return $app->fresh();
    }

    /**
     * Approve the KYC application.
     * DB::transaction — two-table write (application + user.is_merchant).
     */
    public function approve(KycApplication $app, User $admin, ?string $notes): KycApplication
    {
        if ($app->status->isTerminal()) {
            throw new DomainException('kyc.already_reviewed', 409);
        }

        DB::transaction(function () use ($app, $admin, $notes): void {
            $app->approve($admin, $notes);
        });

        $app->load(['applicant', 'documents']);
        event(new KycApplicationApproved($app->fresh()));

        return $app->fresh();
    }

    /**
     * Reject the KYC application.
     * DB::transaction — single-table write but explicit for consistency.
     */
    public function reject(KycApplication $app, User $admin, string $notes): KycApplication
    {
        if ($app->status->isTerminal()) {
            throw new DomainException('kyc.already_reviewed', 409);
        }

        DB::transaction(function () use ($app, $admin, $notes): void {
            $app->reject($admin, $notes);
        });

        $app->load(['applicant', 'documents']);
        event(new KycApplicationRejected($app->fresh()));

        return $app->fresh();
    }
}
