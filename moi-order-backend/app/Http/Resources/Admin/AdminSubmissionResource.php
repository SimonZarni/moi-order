<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Contracts\FileStorageInterface;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\ServiceTypeResource;
use App\Http\Resources\SubmissionDocumentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;

/**
 * Principle: SRP — shapes the admin-facing submission response only.
 * Principle: Security — idempotency_key never exposed. file_path never exposed
 *   (SubmissionDocumentResource generates signed URLs instead).
 *   Admin sees full detail fields (e.g. passport_no) unlike user-facing resource.
 */
class AdminSubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'status'         => $this->status->value,
            'status_label'   => $this->status->label(),
            'price_snapshot' => $this->price_snapshot,
            'completed_at'   => $this->completed_at?->toISOString(),
            'created_at'     => $this->created_at->toISOString(),

            // Admin always sees the user who submitted
            'user' => $this->when(
                $this->relationLoaded('user') && $this->user !== null,
                fn () => [
                    'id'    => $this->user->id,
                    'name'  => $this->user->name,
                    'email' => $this->user->email,
                ]
            ),

            'service_type' => new ServiceTypeResource($this->whenLoaded('serviceType')),

            // Full applicant detail — all fields from whichever detail model is populated.
            // Internal fields (id, submission_id, timestamps) are stripped.
            'detail' => $this->when(
                $this->hasAnyDetailLoaded(),
                function () {
                    $detail = $this->resolveDetail();

                    if ($detail === null) {
                        return null;
                    }

                    return Arr::except($detail->toArray(), [
                        'id', 'submission_id', 'created_at', 'updated_at',
                    ]);
                }
            ),

            'documents' => SubmissionDocumentResource::collection(
                $this->whenLoaded('documents')
            ),

            'payment' => new PaymentResource($this->whenLoaded('payment')),

            // Dynamic schema submissions — resolves file paths to signed URLs.
            'submission_data' => $this->when(
                $this->submission_data !== null,
                function () {
                    /** @var FileStorageInterface $storage */
                    $storage = app(FileStorageInterface::class);
                    $data    = $this->submission_data;
                    $files   = $data['_files'] ?? [];

                    unset($data['_files']); // raw paths never exposed

                    foreach ($files as $key => $path) {
                        $data[$key] = $storage->url($path);
                    }

                    return $data;
                }
            ),
        ];
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function hasAnyDetailLoaded(): bool
    {
        return $this->relationLoaded('ninetyDayReportDetail')
            || $this->relationLoaded('companyRegistrationDetail')
            || $this->relationLoaded('airportFastTrackDetail')
            || $this->relationLoaded('embassyResidentialDetail')
            || $this->relationLoaded('embassyCarLicenseDetail')
            || $this->relationLoaded('embassyBankDetail')
            || $this->relationLoaded('embassyVisaRecommendationDetail')
            || $this->relationLoaded('testServiceDetail');
    }

    private function resolveDetail(): mixed
    {
        return $this->ninetyDayReportDetail
            ?? $this->companyRegistrationDetail
            ?? $this->airportFastTrackDetail
            ?? $this->embassyResidentialDetail
            ?? $this->embassyCarLicenseDetail
            ?? $this->embassyBankDetail
            ?? $this->embassyVisaRecommendationDetail
            ?? $this->testServiceDetail;
    }
}
