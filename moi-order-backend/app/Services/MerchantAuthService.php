<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\MerchantLoginDTO;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Principle: SRP — owns merchant authentication only.
 * Principle: Security:
 *   - Wrong credentials → 422 on email field (same as user auth; avoids field-enumeration).
 *   - Non-merchant account → 403 after credential check (timing-safe: password first, role second).
 *   - Token ability 'merchant' — least-privilege, never '*'.
 */
class MerchantAuthService
{
    /**
     * @return array{user: User, token: string}
     * @throws ValidationException    on bad credentials.
     * @throws AuthorizationException when account is not a merchant.
     */
    public function login(MerchantLoginDTO $dto): array
    {
        $user = User::where('email', $dto->email)->first();

        if ($user === null || ! Hash::check($dto->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check merchant role AFTER password verification — prevents timing-based enumeration.
        if (! $user->isMerchant()) {
            throw new AuthorizationException('Merchant access required.');
        }

        if ($user->isRestricted()) {
            throw new AuthorizationException('Account is suspended.');
        }

        $token = $user->createToken('merchant-auth', ['merchant'])->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout(User $user): void
    {
        $accessToken = $user->currentAccessToken();

        if ($accessToken instanceof PersonalAccessToken) {
            $accessToken->delete();
        }
    }
}
