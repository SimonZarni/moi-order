<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\SendEmailOtpDTO;
use App\DTOs\VerifyEmailOtpDTO;
use App\Enums\EmailOtpPurpose;
use App\Exceptions\DomainException;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns the "verify admin-created merchant email + set own password" flow.
 * Principle: DIP — delegates OTP lifecycle to EmailOtpService.
 *
 * Flow:
 *  1. send()    → fires OTP to the merchant's current email address.
 *  2. confirm() → verifies OTP, sets email_verified_at, replaces password.
 *
 * Security:
 *  - OTP is bound to the authenticated user's email; not a URL parameter.
 *  - Already-verified accounts are rejected early (idempotent guard).
 *  - Password and email_verified_at written in one transaction.
 *  - OTP consumed before any User write — replay impossible.
 */
class MerchantEmailVerificationService
{
    public function __construct(
        private readonly EmailOtpService $emailOtpService,
    ) {}

    /**
     * Send verification OTP to the merchant's registered email.
     *
     * @return array{expires_in: int, resend_after: int}
     * @throws DomainException if the email is already verified.
     */
    public function send(User $user): array
    {
        if ($user->email_verified_at !== null) {
            throw new DomainException('email.already_verified', 409);
        }

        return $this->emailOtpService->send(new SendEmailOtpDTO(
            email:   $user->email,
            purpose: EmailOtpPurpose::AccountVerification,
        ));
    }

    /**
     * Verify the OTP and replace the merchant's password with their own.
     *
     * @throws \Illuminate\Validation\ValidationException on bad OTP.
     * @throws DomainException if already verified.
     */
    public function confirm(User $user, string $otp, string $newPassword): void
    {
        if ($user->email_verified_at !== null) {
            throw new DomainException('email.already_verified', 409);
        }

        // Consume OTP before any write — prevents replay under concurrent requests.
        $this->emailOtpService->verify(new VerifyEmailOtpDTO(
            email:   $user->email,
            otp:     $otp,
            purpose: EmailOtpPurpose::AccountVerification,
        ));

        DB::transaction(function () use ($user, $newPassword): void {
            $user->update([
                'email_verified_at' => now(),
                'password'          => $newPassword,
            ]);
        });
    }
}
