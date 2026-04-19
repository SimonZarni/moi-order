<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminLoginDTO;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Principle: SRP — owns admin authentication logic only. Separate from user AuthService.
 * Principle: Security:
 *   - Wrong credentials → 422 ValidationException on email field (same as user auth;
 *     avoids leaking which field was wrong via 401).
 *   - Non-admin account → 403 AuthorizationException AFTER credential check
 *     (timing-safe: always validate password first, then check role).
 *   - Token ability 'admin' (not '*') — explicit least-privilege.
 */
class AdminAuthService
{
    /**
     * @return array{user: User, token: string}
     * @throws ValidationException      when credentials do not match.
     * @throws AuthorizationException   when the account is not an admin.
     */
    public function login(AdminLoginDTO $dto): array
    {
        $user = User::where('email', $dto->email)->first();

        if ($user === null || ! Hash::check($dto->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check admin role only AFTER password verification — prevents timing-based
        // enumeration of admin vs non-admin accounts.
        if (! $user->isAdmin()) {
            throw new AuthorizationException('Admin access required.');
        }

        $token = $user->createToken('admin-auth', ['admin'])->plainTextToken;

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
