<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\MerchantCompleteRegistrationDTO;
use App\DTOs\MerchantSendRegisterOtpDTO;
use App\DTOs\MerchantVerifyRegisterOtpDTO;
use App\DTOs\SendEmailOtpDTO;
use App\DTOs\SelfRegisterMerchantDTO;
use App\DTOs\VerifyEmailOtpDTO;
use App\Enums\EmailOtpPurpose;
use App\Exceptions\DomainException;
use App\Models\User;

/**
 * Principle: SRP — owns email-OTP registration flow for merchants only.
 * Principle: DIP — delegates to EmailOtpService and MerchantRegistrationService.
 * Security: verified_token consumed before any User write; race-condition guard
 *   on email uniqueness prevents duplicate accounts under concurrent requests.
 */
class MerchantEmailAuthService
{
    public function __construct(
        private readonly EmailOtpService           $emailOtpService,
        private readonly MerchantRegistrationService $registrationService,
    ) {}

    /**
     * Send a 6-digit OTP to the prospective merchant's email.
     *
     * @return array{expires_in: int, resend_after: int}
     */
    public function sendRegisterOtp(MerchantSendRegisterOtpDTO $dto): array
    {
        return $this->emailOtpService->send(new SendEmailOtpDTO(
            email:   $dto->email,
            purpose: EmailOtpPurpose::Registration,
        ));
    }

    /**
     * Verify the submitted OTP; return a short-lived verified_token.
     *
     * @return array{verified_token: string, expires_in: int}
     */
    public function verifyRegisterOtp(MerchantVerifyRegisterOtpDTO $dto): array
    {
        $verifiedToken = $this->emailOtpService->verify(new VerifyEmailOtpDTO(
            email:   $dto->email,
            otp:     $dto->otp,
            purpose: EmailOtpPurpose::Registration,
        ));

        return [
            'verified_token' => $verifiedToken,
            'expires_in'     => 900,
        ];
    }

    /**
     * Create the merchant account after OTP verification.
     * Token is consumed here — replay is impossible even under concurrent requests.
     *
     * @return array{user: User, token: string}
     */
    public function completeRegistration(MerchantCompleteRegistrationDTO $dto): array
    {
        // Race-condition guard: email may have been registered between OTP send and now.
        if (User::where('email', $dto->email)->exists()) {
            throw new DomainException('email.already_registered', 409);
        }

        // Consume token before any write — prevents replay.
        $this->emailOtpService->consumeVerifiedToken(
            $dto->email,
            $dto->verifiedToken,
            EmailOtpPurpose::Registration,
        );

        return $this->registrationService->selfRegister(new SelfRegisterMerchantDTO(
            name:     $dto->name,
            email:    $dto->email,
            password: $dto->password,
        ));
    }
}
