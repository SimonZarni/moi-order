<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\EmailOtpRequestDTO;
use App\DTOs\EmailOtpVerifyDTO;
use App\Mail\OtpCodeMail;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class EmailOtpService
{
    private const CACHE_PREFIX = 'auth:email_otp:';
    private const EXPIRES_IN_SECONDS = 600;
    private const EXPIRES_IN_MINUTES = 10;
    private const CODE_LENGTH = 6;

    /**
     * @return array{otp_request_id: string, expires_in: int, email: string}
     */
    public function requestOtp(EmailOtpRequestDTO $dto): array
    {
        $email = mb_strtolower(trim($dto->email));
        $existingUser = User::where('email', $email)->first();

        if ($dto->purpose === 'login' && $existingUser === null) {
            throw ValidationException::withMessages([
                'email' => ['No account found for this email address. Please register first.'],
            ]);
        }

        if ($dto->purpose === 'register' && $existingUser !== null) {
            throw ValidationException::withMessages([
                'email' => ['This email is already registered. Please sign in instead.'],
            ]);
        }

        $code = str_pad((string) random_int(0, 999999), self::CODE_LENGTH, '0', STR_PAD_LEFT);
        $otpRequestId = (string) Str::uuid();

        Cache::put(self::CACHE_PREFIX . $otpRequestId, [
            'code_hash' => Hash::make($code),
            'email'     => $email,
            'purpose'   => $dto->purpose,
        ], now()->addSeconds(self::EXPIRES_IN_SECONDS));

        Mail::to($email)->send(new OtpCodeMail($code, self::EXPIRES_IN_MINUTES));

        return [
            'otp_request_id' => $otpRequestId,
            'expires_in'     => self::EXPIRES_IN_SECONDS,
            'email'          => $email,
        ];
    }

    /**
     * @return array{user: User, token: string}
     */
    public function verifyOtp(EmailOtpVerifyDTO $dto): array
    {
        $email = mb_strtolower(trim($dto->email));
        $cacheKey = self::CACHE_PREFIX . $dto->otpRequestId;
        $payload = Cache::get($cacheKey);

        if (! is_array($payload)) {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request expired. Please request a new code.'],
            ]);
        }

        if (($payload['email'] ?? null) !== $email || ($payload['purpose'] ?? null) !== $dto->purpose) {
            throw ValidationException::withMessages([
                'otp_request_id' => ['OTP request does not match this email. Please request a new code.'],
            ]);
        }

        $codeHash = $payload['code_hash'] ?? '';
        if (! is_string($codeHash) || ! Hash::check($dto->code, $codeHash)) {
            throw ValidationException::withMessages([
                'code' => ['The verification code is incorrect.'],
            ]);
        }

        Cache::forget($cacheKey);

        $user = $dto->purpose === 'login'
            ? $this->resolveLoginUser($email)
            : $this->registerUser($email, $dto->name);

        $token = $user->createToken('user-auth', ['user'], now()->addDays(30))->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    private function resolveLoginUser(string $email): User
    {
        $user = User::where('email', $email)->first();

        if ($user === null) {
            throw ValidationException::withMessages([
                'email' => ['No account found for this email address.'],
            ]);
        }

        return $user;
    }

    private function registerUser(string $email, ?string $name): User
    {
        if ($name === null || trim($name) === '') {
            throw ValidationException::withMessages([
                'name' => ['Full name is required to create your account.'],
            ]);
        }

        if (User::where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['This email is already registered. Please sign in instead.'],
            ]);
        }

        return User::create([
            'name'     => trim($name),
            'email'    => $email,
            'password' => null,
        ]);
    }
}
