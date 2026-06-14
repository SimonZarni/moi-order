<?php

declare(strict_types=1);

namespace App\Http\Resources\Merchant;

use App\Models\KycApplication;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes merchant user API output.
 * kyc_status: loaded from the user's latest KycApplication (null if none exists).
 * This lets the mobile app decide which screen to show after OTP login.
 */
class MerchantUserResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->uuid,
            'int_id'         => $this->id,
            'name'           => $this->name,
            'email'          => $this->email,
            'phone'          => $this->phone_number,
            'is_merchant'    => $this->is_merchant,
            'email_verified' => $this->email_verified_at !== null,
            'has_password'   => ! empty($this->password),
            'kyc_status'     => $this->resolveKycStatus(),
            'created_at'     => $this->created_at?->toIso8601String(),
        ];
    }

    /** Returns the value-string of the latest KYC application status, or null. */
    private function resolveKycStatus(): ?string
    {
        /** @var KycApplication|null $application */
        $application = KycApplication::forUser($this->id)
            ->latest()
            ->first();

        return $application?->status->value;
    }
}
