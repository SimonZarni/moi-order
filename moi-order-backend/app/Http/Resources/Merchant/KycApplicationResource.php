<?php

declare(strict_types=1);

namespace App\Http\Resources\Merchant;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes KycApplication API output.
 * Principle: Security — sensitive reviewer details never exposed beyond reviewed_at + notes.
 * Documents are always included (loaded by KycService before returning).
 */
class KycApplicationResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        /** @var \App\Models\KycApplication $this */
        return [
            'id'               => $this->id,
            'user_id'          => $this->user_id,
            'user_name'        => $this->whenLoaded('applicant', fn () => $this->applicant->name),
            'user_email'       => $this->whenLoaded('applicant', fn () => $this->applicant->email),
            'user_phone'       => $this->whenLoaded('applicant', fn () => $this->applicant->phone_number),
            'business_name'    => $this->business_name,
            'business_type'    => $this->business_type,
            'business_address' => $this->business_address,
            'business_phone'   => $this->business_phone,
            'status'           => $this->status->value,
            'status_label'     => $this->status->label(),
            'review_notes'     => $this->review_notes,
            'reviewed_at'      => $this->reviewed_at?->toIso8601String(),
            'submitted_at'     => $this->submitted_at?->toIso8601String(),
            'documents'        => KycDocumentResource::collection($this->whenLoaded('documents')),
            'created_at'       => $this->created_at?->toIso8601String(),
        ];
    }
}
