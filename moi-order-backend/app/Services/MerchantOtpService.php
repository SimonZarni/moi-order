<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\MerchantOtpRequestDTO;
use App\DTOs\MerchantOtpVerifyDTO;
use App\Enums\UserStatusEnum;
use App\Models\KycApplication;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Principle: SRP — owns OTP-based merchant authentication only.
 * Principle: DIP — ThaiBulkSmsOtpService injected, never newed inside.
 * Principle: Security — normalises phone number; finds-or-creates user safely;
 *   token carries 'merchant' ability with 30-day TTL.
 *
 * Unlike OtpAuthService (user OTP), this service does NOT restrict to existing users:
 * a brand-new registrant can start merchant onboarding immediately after OTP verification.
 */
class MerchantOtpService
{
    private const CACHE_PREFIX = 'merchant:otp:';
    private const EXPIRES_IN_SECONDS = 300;

    public function __construct(
        private readonly ThaiBulkSmsOtpService $thaiBulkSmsOtpService,
    ) {}

    /**
     * Request an OTP for merchant login / registration.
     * Phone is normalised to Thai international format (66XXXXXXXXX).
     *
     * @return array{otp_request_id: string, expires_in: int, phone_number: string}
     */
    public function requestOtp(MerchantOtpRequestDTO $dto): array
    {
        $phoneNumber  = $this->normalizeThaiPhoneNumber($dto->phoneNumber);
        $providerToken = $this->thaiBulkSmsOtpService->requestOtp($phoneNumber);
        $otpRequestId  = (string) Str::uuid();

        Cache::put(self::CACHE_PREFIX . $otpRequestId, [
            'provider_token' => $providerToken,
            'phone_number'   => $phoneNumber,
        ], now()->addSeconds(self::EXPIRES_IN_SECONDS));

        return [
            'otp_request_id' => $otpRequestId,
            'expires_in'     => self::EXPIRES_IN_SECONDS,
            'phone_number'   => $phoneNumber,
        ];
    }

    /**
     * Verify OTP and return (or create) the merchant user with a token.
     *
     * @return array{user: User, token: string, kyc_status: string|null}
     * @throws ValidationException   when OTP is expired or pin is wrong.
     * @throws AuthorizationException when the account is suspended/banned.
     */
    public function verifyOtp(MerchantOtpVerifyDTO $dto): array
    {
        $phoneNumber = $this->normalizeThaiPhoneNumber($dto->phoneNumber);
        $cacheKey    = self::CACHE_PREFIX . $dto->otpRequestId;
        $payload     = Cache::get($cacheKey);

        if (! is_array($payload)) {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request expired. Please request a new code.'],
            ]);
        }

        if (($payload['phone_number'] ?? null) !== $phoneNumber) {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request does not match this phone number.'],
            ]);
        }

        $providerToken = $payload['provider_token'] ?? null;
        if (! is_string($providerToken) || $providerToken === '') {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request expired. Please request a new code.'],
            ]);
        }

        // Throws ValidationException on wrong PIN via ThaiBulkSmsOtpService.
        $this->thaiBulkSmsOtpService->verifyOtp($providerToken, $dto->pin);

        // Single-use: consumed after successful verification.
        Cache::forget($cacheKey);

        $user = $this->findOrCreateMerchantUser($phoneNumber);

        $this->assertNotRestricted($user);

        $token = $user->createToken(
            'merchant-otp-auth',
            ['merchant'],
            now()->addDays(30)
        )->plainTextToken;

        $kycStatus = $this->resolveKycStatus($user);

        return [
            'user'       => $user,
            'token'      => $token,
            'kyc_status' => $kycStatus,
        ];
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function findOrCreateMerchantUser(string $phoneNumber): User
    {
        $user = User::where('phone_number', $phoneNumber)->first();

        if ($user !== null) {
            return $user;
        }

        // New user — no email yet; placeholder follows the same convention as OtpAuthService.
        return User::create([
            'name'         => 'Merchant',
            'email'        => 'merchant_phone_' . $phoneNumber . '@users.moiorder.local',
            'phone_number' => $phoneNumber,
            'password'     => null,
            'is_merchant'  => false,
        ]);
    }

    private function assertNotRestricted(User $user): void
    {
        if ($user->isRestricted()) {
            throw new AuthorizationException('Account is suspended or banned.');
        }
    }

    /** Returns the value-string of the latest KycApplication status, or null. */
    private function resolveKycStatus(User $user): ?string
    {
        /** @var KycApplication|null $application */
        $application = KycApplication::forUser($user->id)
            ->latest()
            ->first();

        return $application?->status->value;
    }

    /**
     * Normalise Thai mobile numbers to the international format 66XXXXXXXXX.
     * Mirrors the logic in OtpAuthService for consistency.
     */
    private function normalizeThaiPhoneNumber(string $phoneNumber): string
    {
        $digits = preg_replace('/\D+/', '', $phoneNumber) ?? '';

        if ($digits === '') {
            throw ValidationException::withMessages([
                'phone_number' => ['Phone number is required.'],
            ]);
        }

        if (str_starts_with($digits, '66') && strlen($digits) === 11) {
            return $digits;
        }

        if (str_starts_with($digits, '0') && strlen($digits) === 10) {
            return '66' . substr($digits, 1);
        }

        if (strlen($digits) === 9 && in_array($digits[0], ['6', '8', '9'], true)) {
            return '66' . $digits;
        }

        throw ValidationException::withMessages([
            'phone_number' => ['Enter a valid Thai mobile number.'],
        ]);
    }
}
