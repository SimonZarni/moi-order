<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes the submission HTTP response only.
 * Principle: Security — idempotency_key not exposed (internal deduplication detail).
 *   price_snapshot in satangs; client formats for display.
 *   detail and documents only when loaded (whenLoaded prevents N+1).
 */
class ServiceSubmissionResource extends JsonResource
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
            'service_type'   => new ServiceTypeResource($this->whenLoaded('serviceType')),
            'detail' => $this->when(
                $this->relationLoaded('ninetyDayReportDetail')
                    || $this->relationLoaded('companyRegistrationDetail')
                    || $this->relationLoaded('airportFastTrackDetail')
                    || $this->relationLoaded('embassyResidentialDetail')
                    || $this->relationLoaded('embassyCarLicenseDetail')
                    || $this->relationLoaded('embassyBankDetail')
                    || $this->relationLoaded('embassyVisaRecommendationDetail')
                    || $this->relationLoaded('testServiceDetail'),
                function () {
                    $detail = $this->ninetyDayReportDetail
                        ?? $this->companyRegistrationDetail
                        ?? $this->airportFastTrackDetail
                        ?? $this->embassyResidentialDetail
                        ?? $this->embassyCarLicenseDetail
                        ?? $this->embassyBankDetail
                        ?? $this->embassyVisaRecommendationDetail
                        ?? $this->testServiceDetail;

                    // Guard: a submission may have relations eager-loaded but no
                    // detail row yet (e.g. service type added after submission created).
                    if ($detail === null) {
                        return null;
                    }

                    return [
                        'full_name' => $detail->full_name,
                        'phone'     => $detail->phone,
                    ];
                }
            ),
            'documents' => SubmissionDocumentResource::collection(
                $this->whenLoaded('documents')
            ),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
        ];
    }
}
