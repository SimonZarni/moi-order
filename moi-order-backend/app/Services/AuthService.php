<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\LoginDTO;
use App\DTOs\RegisterDTO;
use App\Exceptions\DomainException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Principle: SRP — owns authentication business logic only.
 * Principle: Security — passwords hashed with bcrypt (Laravel default, cost≥12).
 *   Invalid credentials surface as a 422 ValidationException on the email field
 *   (standard Laravel convention — avoids exposing which field was wrong via 401).
 *   Tokens created with explicit abilities. Current token deleted on logout.
 */
class AuthService
{
    /**
     * Returns the auth method for a given email so the client can route
     * the user to the correct sign-in step without exposing a password field
     * for social-only accounts.
     *
     * Priority: password > google > apple > line > not_found
     */
    public function checkEmail(string $email): string
    {
        $user = User::where('email', $email)->first();

        if ($user === null) {
            return 'not_found';
        }

        if ($user->password !== null) {
            return 'password';
        }

        if ($user->google_id !== null) {
            return 'google';
        }

        if ($user->apple_id !== null) {
            return 'apple';
        }

        if ($user->line_id !== null) {
            return 'line';
        }

        return 'not_found';
    }

    /**
     * @return array{user: User, token: string}
     * @throws ValidationException when credentials do not match.
     */
    public function login(LoginDTO $dto): array
    {
        $user = User::where('email', $dto->email)->first();

        if ($user === null) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Social-only account — password has never been set.
        if ($user->password === null) {
            throw new DomainException('account.no_password', 409);
        }

        if (! Hash::check($dto->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->email_verified_at === null) {
            throw new DomainException('email.not_verified', 409);
        }

        if ($user->isRestricted()) {
            $code    = $user->status->value === 'banned' ? 'account.banned' : 'account.suspended';
            $context = $user->suspended_until !== null
                ? ['suspended_until' => $user->suspended_until->toISOString()]
                : [];
            throw new DomainException($code, 403, $context);
        }

        $token = $user->createToken('user-auth', ['user'], now()->addDays(30))->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * @return array{user: User, token: string}
     */
    public function register(RegisterDTO $dto): array
    {
        $user = User::create([
            'name'     => $dto->name,
            'email'    => $dto->email,
            'password' => $dto->password,
        ]);

        $token = $user->createToken('user-auth', ['user'], now()->addDays(30))->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout(User $user): void
    {
        // currentAccessToken() returns the PersonalAccessToken set by Sanctum during
        // authentication. Must be called as a method — NOT as a property — because
        // Laravel 11's __get() would invoke it as an Eloquent relationship and throw
        // "must return a relationship instance."
        $accessToken = $user->currentAccessToken();

        if ($accessToken instanceof \Laravel\Sanctum\PersonalAccessToken) {
            $accessToken->delete();
        }
    }
}
