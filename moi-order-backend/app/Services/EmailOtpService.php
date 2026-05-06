<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\SendEmailOtpDTO;
use App\DTOs\VerifyEmailOtpDTO;
use App\Enums\EmailOtpPurpose;
use App\Exceptions\DomainException;
use App\Mail\EmailOtpMail;
use App\Models\EmailOtp;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Principle: SRP — owns the full OTP lifecycle for email verification only.
 * Security: OTP stored as bcrypt hash. Single-use enforced via verified_at.
 *   Max 5 wrong attempts before invalidation (brute-force guard).
 *   Resend blocked for 30 s (prevents enumeration via timing).
 *   Password-reset send always returns 200 regardless of whether email exists.
 */
class EmailOtpService
{
    private const EXPIRES_IN_MINUTES          = 10;
    private const RESEND_COOLDOWN_SECONDS     = 30;
    private const MAX_ATTEMPTS                = 5;
    private const VERIFIED_TOKEN_EXPIRES_MIN  = 15;

    /**
     * Send a 6-digit OTP to the given email.
     * Enumeration-safe for password_reset: always returns success even if no account exists.
     *
     * @return array{expires_in: int, resend_after: int}
     */
    public function send(SendEmailOtpDTO $dto): array
    {
        if ($dto->purpose === EmailOtpPurpose::Registration && User::where('email', $dto->email)->exists()) {
            throw new DomainException('email.already_registered', 409);
        }

        $recent = EmailOtp::where('email', $dto->email)
            ->where('purpose', $dto->purpose->value)
            ->whereNull('verified_at')
            ->where('created_at', '>=', now()->subSeconds(self::RESEND_COOLDOWN_SECONDS))
            ->first();

        if ($recent !== null) {
            $secondsLeft = (int) ceil(
                self::RESEND_COOLDOWN_SECONDS - $recent->created_at->diffInSeconds(now())
            );
            throw new DomainException('otp.resend_too_soon', 409, ['retry_after' => max(1, $secondsLeft)]);
        }

        // Purge stale unverified OTPs so only one active record exists per email+purpose.
        EmailOtp::where('email', $dto->email)
            ->where('purpose', $dto->purpose->value)
            ->whereNull('verified_at')
            ->delete();

        $plain = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        EmailOtp::create([
            'email'      => $dto->email,
            'otp'        => Hash::make($plain),
            'purpose'    => $dto->purpose->value,
            'expires_at' => now()->addMinutes(self::EXPIRES_IN_MINUTES),
            'attempts'   => 0,
        ]);

        Mail::to($dto->email)->queue(new EmailOtpMail($plain, $dto->purpose));

        return [
            'expires_in'   => self::EXPIRES_IN_MINUTES * 60,
            'resend_after' => self::RESEND_COOLDOWN_SECONDS,
        ];
    }

    /**
     * Verify the submitted OTP and return a short-lived verified_token for the next step.
     * Wrapped in a transaction with lockForUpdate to prevent concurrent verification races.
     */
    public function verify(VerifyEmailOtpDTO $dto): string
    {
        return DB::transaction(function () use ($dto): string {
            $record = EmailOtp::where('email', $dto->email)
                ->where('purpose', $dto->purpose->value)
                ->whereNull('verified_at')
                ->latest()
                ->lockForUpdate()
                ->first();

            if ($record === null) {
                throw ValidationException::withMessages([
                    'otp' => ['No active OTP found. Please request a new code.'],
                ]);
            }

            if ($record->isExpired()) {
                throw ValidationException::withMessages([
                    'otp' => ['This code has expired. Please request a new one.'],
                ]);
            }

            if ($record->hasExceededAttempts()) {
                throw ValidationException::withMessages([
                    'otp' => ['Too many failed attempts. Please request a new code.'],
                ]);
            }

            $record->increment('attempts');

            if (! Hash::check($dto->otp, $record->otp)) {
                $remaining = self::MAX_ATTEMPTS - $record->fresh()?->attempts ?? 0;
                throw ValidationException::withMessages([
                    'otp' => ["Incorrect code. {$remaining} attempt(s) remaining."],
                ]);
            }

            $verifiedToken = (string) Str::uuid();

            $record->update([
                'verified_at'               => now(),
                'verified_token'            => $verifiedToken,
                'verified_token_expires_at' => now()->addMinutes(self::VERIFIED_TOKEN_EXPIRES_MIN),
            ]);

            return $verifiedToken;
        });
    }

    /**
     * Consume a verified_token, asserting it is valid and not expired.
     * Deletes the record on success — single-use enforcement.
     */
    public function consumeVerifiedToken(string $email, string $token, EmailOtpPurpose $purpose): void
    {
        $record = EmailOtp::where('email', $email)
            ->where('purpose', $purpose->value)
            ->where('verified_token', $token)
            ->whereNotNull('verified_at')
            ->first();

        if ($record === null || $record->isVerifiedTokenExpired()) {
            throw ValidationException::withMessages([
                'verified_token' => ['Your verification has expired. Please start the process again.'],
            ]);
        }

        $record->delete();
    }
}
