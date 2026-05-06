<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\GoogleAuthDTO;
use App\Exceptions\DomainException;
use App\Models\User;
use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Config;
use Illuminate\Validation\ValidationException;

/**
 * Principle: SRP — owns Google OAuth authentication only.
 * Principle: DIP — receives GoogleClient via constructor injection; never instantiates it.
 * Security: verifies the ID token signature and audience before trusting any payload field.
 *   email_verified checked so unverified Google accounts cannot authenticate.
 *   google_id lookup takes precedence over email to prevent email-swap attacks.
 */
class GoogleAuthService
{
    public function __construct(
        private readonly GoogleClient $googleClient,
    ) {}

    /**
     * @return array{user: User, token: string}
     * @throws ValidationException when the ID token is invalid.
     */
    public function authenticate(GoogleAuthDTO $dto): array
    {
        $payload = $this->verifyToken($dto->idToken);

        if ($payload === false || empty($payload['email_verified'])) {
            throw ValidationException::withMessages([
                'id_token' => ['Google sign-in failed. Please try again.'],
            ]);
        }

        $googleId = (string) $payload['sub'];
        $email    = (string) $payload['email'];
        $name     = (string) ($payload['name'] ?? $email);

        $user = $this->findOrCreateUser($googleId, $email, $name);

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

    public function linkAccount(User $currentUser, GoogleAuthDTO $dto): User
    {
        $payload = $this->verifyToken($dto->idToken);

        if ($payload === false || empty($payload['email_verified'])) {
            throw ValidationException::withMessages([
                'id_token' => ['Google sign-in failed. Please try again.'],
            ]);
        }

        $googleId = (string) $payload['sub'];
        $email    = (string) $payload['email'];
        $name     = (string) ($payload['name'] ?? $email);

        $otherUser = User::where('google_id', $googleId)->where('id', '!=', $currentUser->id)->first();
        if ($otherUser !== null) {
            throw ValidationException::withMessages([
                'id_token' => ['This Google account is already linked to another account.'],
            ]);
        }

        $updates = ['google_id' => $googleId];
        if ($this->shouldReplaceEmail($currentUser->email) && $email !== '') {
            $updates['email'] = $email;
        }
        if ($currentUser->name === '' || $currentUser->name === 'Deleted User') {
            $updates['name'] = $name;
        }

        $currentUser->update($updates);

        return $currentUser->fresh();
    }

    private function findOrCreateUser(string $googleId, string $email, string $name): User
    {
        // Step 1: find by google_id including soft-deleted rows.
        $user = User::withTrashed()->where('google_id', $googleId)->first();

        if ($user !== null) {
            if ($user->trashed()) {
                $user->restore();
            }
            return $user;
        }

        // Step 2: email match means an existing account (password or other social).
        // Never auto-link — require the user to connect Google explicitly from profile.
        $user = User::where('email', $email)->first();

        if ($user !== null) {
            throw new DomainException('account.email_exists', 409);
        }

        // Step 3: brand-new user — email is verified by Google.
        // ->fresh() reloads DB defaults (e.g. user_role, status) so UserResource
        // casts never receive null for non-nullable enum columns.
        return User::create([
            'google_id'         => $googleId,
            'email'             => $email,
            'name'              => $name,
            'password'          => null,
            'email_verified_at' => now(),
        ])->fresh();
    }

    private function shouldReplaceEmail(string $email): bool
    {
        return str_ends_with($email, '@users.moiorder.local') || str_ends_with($email, '@deleted.invalid');
    }

    /**
     * Try verifying against web client ID first, then iOS client ID.
     * iOS native sign-in can issue tokens with the iOS client ID as audience.
     *
     * @return array<string,mixed>|false
     */
    private function verifyToken(string $idToken): array|false
    {
        $payload = $this->googleClient->verifyIdToken($idToken);

        if ($payload !== false) {
            return $payload;
        }

        $iosClientId = Config::get('services.google.ios_client_id');
        if (empty($iosClientId)) {
            return false;
        }

        $this->googleClient->setClientId($iosClientId);
        $payload = $this->googleClient->verifyIdToken($idToken);
        $this->googleClient->setClientId(Config::get('services.google.client_id'));

        return $payload;
    }
}
