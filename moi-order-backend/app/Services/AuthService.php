<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\LoginDTO;
use App\DTOs\RegisterDTO;
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
     * @return array{user: User, token: string}
     * @throws ValidationException when credentials do not match.
     */
    public function login(LoginDTO $dto): array
    {
        $user = User::where('email', $dto->email)->first();

        if ($user === null || $user->password === null || ! Hash::check($dto->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
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
            'password' => Hash::make($dto->password),
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
