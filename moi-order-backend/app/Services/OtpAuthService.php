<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\OtpRequestDTO;
use App\DTOs\OtpVerifyDTO;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OtpAuthService
{
    private const CACHE_PREFIX = 'auth:otp:';
    private const EXPIRES_IN_SECONDS = 300;

    public function __construct(
        private readonly ThaiBulkSmsOtpService $thaiBulkSmsOtpService,
    ) {}

    /**
     * @return array{otp_request_id: string, expires_in: int, phone_number: string}
     */
    public function requestOtp(OtpRequestDTO $dto): array
    {
        $phoneNumber = $this->normalizeThaiPhoneNumber($dto->phoneNumber);
        $existingUser = User::where('phone_number', $phoneNumber)->first();

        if ($dto->purpose === 'login' && $existingUser === null) {
            throw ValidationException::withMessages([
                'phone_number' => ['No account found for this phone number. Please register first.'],
            ]);
        }

        if ($dto->purpose === 'register' && $existingUser !== null) {
            throw ValidationException::withMessages([
                'phone_number' => ['This phone number is already registered. Please sign in instead.'],
            ]);
        }

        $providerToken = $this->thaiBulkSmsOtpService->requestOtp($phoneNumber);
        $otpRequestId = (string) Str::uuid();

        Cache::put(self::CACHE_PREFIX . $otpRequestId, [
            'provider_token' => $providerToken,
            'phone_number' => $phoneNumber,
            'purpose' => $dto->purpose,
        ], now()->addSeconds(self::EXPIRES_IN_SECONDS));

        return [
            'otp_request_id' => $otpRequestId,
            'expires_in' => self::EXPIRES_IN_SECONDS,
            'phone_number' => $phoneNumber,
        ];
    }

    /**
     * @return array{user: User, token: string}
     */
    public function verifyOtp(OtpVerifyDTO $dto): array
    {
        $phoneNumber = $this->normalizeThaiPhoneNumber($dto->phoneNumber);
        $cacheKey = self::CACHE_PREFIX . $dto->otpRequestId;
        $payload = Cache::get($cacheKey);

        if (! is_array($payload)) {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request expired. Please request a new code.'],
            ]);
        }

        if (($payload['phone_number'] ?? null) !== $phoneNumber || ($payload['purpose'] ?? null) !== $dto->purpose) {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request does not match this phone number. Please request a new code.'],
            ]);
        }

        $providerToken = $payload['provider_token'] ?? null;
        if (! is_string($providerToken) || $providerToken === '') {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request expired. Please request a new code.'],
            ]);
        }

        $this->thaiBulkSmsOtpService->verifyOtp($providerToken, $dto->pin);
        Cache::forget($cacheKey);

        $user = $dto->purpose === 'login'
            ? $this->resolveLoginUser($phoneNumber)
            : $this->registerUser($phoneNumber, $dto->name);

        $token = $user->createToken('user-auth', ['user'], now()->addDays(30))->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * @return array{otp_request_id: string, expires_in: int, phone_number: string}
     */
    public function requestPhoneUpdate(User $user, string $rawPhone): array
    {
        $phoneNumber = $this->normalizeThaiPhoneNumber($rawPhone);

        $other = User::where('phone_number', $phoneNumber)
            ->where('id', '!=', $user->id)
            ->first();

        if ($other !== null) {
            throw ValidationException::withMessages([
                'phone_number' => ['This phone number is already linked to another account.'],
            ]);
        }

        $providerToken = $this->thaiBulkSmsOtpService->requestOtp($phoneNumber);
        $otpRequestId  = (string) Str::uuid();

        Cache::put(self::CACHE_PREFIX . $otpRequestId, [
            'provider_token' => $providerToken,
            'phone_number'   => $phoneNumber,
            'purpose'        => 'phone_update',
            'user_id'        => $user->id,
        ], now()->addSeconds(self::EXPIRES_IN_SECONDS));

        return [
            'otp_request_id' => $otpRequestId,
            'expires_in'     => self::EXPIRES_IN_SECONDS,
            'phone_number'   => $phoneNumber,
        ];
    }

    /**
     * Verifies a phone-update OTP and returns the normalised phone number.
     * Does NOT create a session — the caller is responsible for updating the user record.
     */
    public function verifyPhoneUpdate(string $otpRequestId, string $rawPhone, string $pin, int $userId): string
    {
        $phoneNumber = $this->normalizeThaiPhoneNumber($rawPhone);
        $cacheKey    = self::CACHE_PREFIX . $otpRequestId;
        $payload     = Cache::get($cacheKey);

        if (! is_array($payload)) {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request expired. Please request a new code.'],
            ]);
        }

        if (
            ($payload['phone_number'] ?? null) !== $phoneNumber
            || ($payload['purpose'] ?? null) !== 'phone_update'
            || ($payload['user_id'] ?? null) !== $userId
        ) {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request does not match. Please request a new code.'],
            ]);
        }

        $providerToken = $payload['provider_token'] ?? null;
        if (! is_string($providerToken) || $providerToken === '') {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request expired. Please request a new code.'],
            ]);
        }

        $this->thaiBulkSmsOtpService->verifyOtp($providerToken, $pin);
        Cache::forget($cacheKey);

        return $phoneNumber;
    }

    private function resolveLoginUser(string $phoneNumber): User
    {
        $user = User::where('phone_number', $phoneNumber)->first();

        if ($user === null) {
            throw ValidationException::withMessages([
                'phone_number' => ['No account found for this phone number. Please register first.'],
            ]);
        }

        return $user;
    }

    private function registerUser(string $phoneNumber, ?string $name): User
    {
        if ($name === null || trim($name) === '') {
            throw ValidationException::withMessages([
                'name' => ['Full name is required to create your account.'],
            ]);
        }

        if (User::where('phone_number', $phoneNumber)->exists()) {
            throw ValidationException::withMessages([
                'phone_number' => ['This phone number is already registered. Please sign in instead.'],
            ]);
        }

        return User::create([
            'name' => trim($name),
            'email' => $this->placeholderEmail($phoneNumber),
            'phone_number' => $phoneNumber,
            'password' => null,
        ]);
    }

    private function placeholderEmail(string $phoneNumber): string
    {
        return sprintf('phone_%s@users.moiorder.local', $phoneNumber);
    }

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
