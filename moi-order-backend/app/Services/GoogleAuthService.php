<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\GoogleAuthDTO;
use App\Exceptions\DomainException;
use App\Models\User;
use Google\Client as GoogleClient;
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
        $payload = $this->googleClient->verifyIdToken($dto->idToken);

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
            $code = $user->status->value === 'banned' ? 'account.banned' : 'account.suspended';
            throw new DomainException($code, 403);
        }

        $token = $user->createToken('user-auth', ['user'], now()->addDays(30))->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    private function findOrCreateUser(string $googleId, string $email, string $name): User
    {
        // Prefer google_id lookup — immune to email change on the Google account side.
        $user = User::where('google_id', $googleId)->first();

        if ($user !== null) {
            return $user;
        }

        // Existing email account — link Google to it so future logins use google_id.
        $user = User::where('email', $email)->first();

        if ($user !== null) {
            $user->update(['google_id' => $googleId]);
            return $user;
        }

        // Brand new user via Google — no password needed.
        return User::create([
            'google_id' => $googleId,
            'email'     => $email,
            'name'      => $name,
            'password'  => null,
        ]);
    }
}
