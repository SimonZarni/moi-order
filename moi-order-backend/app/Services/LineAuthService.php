<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\LineAuthDTO;
use App\Exceptions\DomainException;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

/**
 * Principle: SRP — owns LINE OAuth authentication only.
 * Security: verifies the LINE ID token server-side before trusting profile claims.
 */
class LineAuthService
{
    private const VERIFY_URL = 'https://api.line.me/oauth2/v2.1/verify';
    private const TOKEN_ERROR = 'LINE sign-in failed. Please try again.';

    /**
     * @return array{user: User, token: string}
     * @throws ValidationException when the ID token is invalid.
     */
    public function authenticate(LineAuthDTO $dto): array
    {
        $payload = $this->verifyIdentityToken($dto);

        $lineId = (string) ($payload['sub'] ?? '');
        $email  = isset($payload['email']) && is_string($payload['email']) && $payload['email'] !== ''
            ? $payload['email']
            : null;
        $resolvedEmail = $email ?? $this->placeholderEmail($lineId);
        $name = $dto->name
            ?? (is_string($payload['name'] ?? null) && $payload['name'] !== '' ? $payload['name'] : null)
            ?? $email
            ?? 'LINE User';

        if ($lineId === '') {
            throw ValidationException::withMessages([
                'id_token' => [self::TOKEN_ERROR],
            ]);
        }

        $user = $this->findOrCreateUser($lineId, $resolvedEmail, $name, $email !== null);

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

    public function linkAccount(User $currentUser, LineAuthDTO $dto): User
    {
        $payload = $this->verifyIdentityToken($dto);

        $lineId = (string) ($payload['sub'] ?? '');
        $email  = isset($payload['email']) && is_string($payload['email']) && $payload['email'] !== ''
            ? $payload['email']
            : null;
        $name = $dto->name
            ?? (is_string($payload['name'] ?? null) && $payload['name'] !== '' ? $payload['name'] : null)
            ?? $email
            ?? 'LINE User';

        if ($lineId === '') {
            throw ValidationException::withMessages([
                'id_token' => [self::TOKEN_ERROR],
            ]);
        }

        $otherUser = User::withTrashed()->where('line_id', $lineId)->where('id', '!=', $currentUser->id)->first();
        if ($otherUser !== null) {
            throw ValidationException::withMessages([
                'id_token' => ['This LINE account is already linked to another account.'],
            ]);
        }

        $updates = ['line_id' => $lineId, 'name' => $name];
        if ($email !== null && $this->shouldReplaceEmail($currentUser->email)) {
            $updates['email'] = $email;
        }

        $currentUser->update($updates);

        return $currentUser->fresh();
    }

    /**
     * @return array<string, mixed>
     */
    private function verifyIdentityToken(LineAuthDTO $dto): array
    {
        $channelId = (string) config('services.line.channel_id');

        if ($channelId === '') {
            throw ValidationException::withMessages([
                'id_token' => [self::TOKEN_ERROR],
            ]);
        }

        $payload = [
            'id_token'  => $dto->idToken,
            'client_id' => $channelId,
        ];

        if ($dto->nonce !== null) {
            $payload['nonce'] = $dto->nonce;
        }

        $response = Http::asForm()
            ->timeout(10)
            ->acceptJson()
            ->post(self::VERIFY_URL, $payload);

        if (! $response->ok()) {
            throw ValidationException::withMessages([
                'id_token' => [self::TOKEN_ERROR],
            ]);
        }

        $verified = $response->json();

        if (! is_array($verified)) {
            throw ValidationException::withMessages([
                'id_token' => [self::TOKEN_ERROR],
            ]);
        }

        return $verified;
    }

    private function findOrCreateUser(string $lineId, string $email, string $name, bool $hasVerifiedEmail): User
    {
        $user = User::withTrashed()->where('line_id', $lineId)->first();

        if ($user !== null) {
            if ($user->trashed()) {
                $user->restore();
            }

            $updates = [];

            if ($user->name !== $name) {
                $updates['name'] = $name;
            }

            if ($hasVerifiedEmail && $user->email !== $email) {
                $updates['email'] = $email;
            }

            if ($updates !== []) {
                $user->update($updates);

                return $user->fresh();
            }

            return $user;
        }

        $user = $hasVerifiedEmail ? User::where('email', $email)->first() : null;

        if ($user !== null) {
            $user->update([
                'line_id' => $lineId,
                'name'    => $name,
            ]);

            return $user->fresh();
        }

        return User::create([
            'line_id'           => $lineId,
            'email'             => $email,
            'name'              => $name,
            'password'          => null,
            'email_verified_at' => now(),
        ])->fresh();
    }

    private function placeholderEmail(string $lineId): string
    {
        return sprintf('line_%s@users.moiorder.local', $lineId);
    }

    private function shouldReplaceEmail(string $email): bool
    {
        return str_ends_with($email, '@users.moiorder.local') || str_ends_with($email, '@deleted.invalid');
    }
}
