<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CompleteRegistrationDTO;
use App\DTOs\ResetPasswordDTO;
use App\Enums\EmailOtpPurpose;
use App\Exceptions\DomainException;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns email-based registration and password-reset flows only.
 * Security: verified_token consumed before any write — replay is impossible.
 *   On password reset, all existing tokens are revoked.
 *   Enumeration-safe: resetPassword returns void regardless of whether email exists.
 */
class EmailAuthService
{
    public function __construct(
        private readonly EmailOtpService $emailOtpService,
    ) {}

    /**
     * Complete email registration after OTP verification.
     *
     * @return array{user: User, token: string}
     */
    public function completeRegistration(CompleteRegistrationDTO $dto): array
    {
        if (User::where('email', $dto->email)->exists()) {
            throw new DomainException('email.already_registered', 409);
        }

        // Consume token first — if this throws, no user is created.
        $this->emailOtpService->consumeVerifiedToken(
            $dto->email,
            $dto->verifiedToken,
            EmailOtpPurpose::Registration,
        );

        $user = DB::transaction(function () use ($dto): User {
            return User::create([
                'name'              => $dto->name,
                'email'             => $dto->email,
                'password'          => $dto->password,
                'email_verified_at' => now(),
            ]);
        });

        $token = $user->createToken('user-auth', ['user'], now()->addDays(30))->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * Set a new password after OTP verification (also works for social-only accounts adding a password).
     * Enumeration-safe: silently succeeds if the email has no account.
     */
    public function resetPassword(ResetPasswordDTO $dto): void
    {
        // Consume token before any writes — prevents replay even if user lookup fails.
        $this->emailOtpService->consumeVerifiedToken(
            $dto->email,
            $dto->verifiedToken,
            EmailOtpPurpose::PasswordReset,
        );

        $user = User::where('email', $dto->email)->first();

        if ($user === null) {
            return; // enumeration-safe: verified_token already consumed, nothing leaked
        }

        DB::transaction(function () use ($user, $dto): void {
            $user->update([
                'password'          => $dto->password,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);

            // Revoke all active tokens — forces re-login with new password.
            $user->tokens()->delete();
        });
    }
}
