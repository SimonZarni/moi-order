<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
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
            'has_result'     => $this->result_path !== null,
            'service_type'   => new ServiceTypeResource($this->whenLoaded('serviceType')),
            'documents' => SubmissionDocumentResource::collection(
                $this->whenLoaded('documents')
            ),
            'payment' => $this->when(
                $this->relationLoaded('payment'),
                fn () => new PaymentResource($this->payment)
            ),

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
}
