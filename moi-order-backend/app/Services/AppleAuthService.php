<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AppleAuthDTO;
use App\Exceptions\DomainException;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

/**
 * Principle: SRP — owns Apple OAuth authentication only.
 * Security: verifies the Apple JWT signature, issuer, audience, and expiry
 *   before trusting any payload field.
 */
class AppleAuthService
{
    private const APPLE_ISSUER = 'https://appleid.apple.com';
    private const JWKS_CACHE_KEY = 'apple-auth:jwks';

    /**
     * @return array{user: User, token: string}
     * @throws ValidationException when the identity token is invalid.
     */
    public function authenticate(AppleAuthDTO $dto): array
    {
        $payload = $this->verifyIdentityToken($dto->idToken);

        $appleId = (string) ($payload['sub'] ?? '');
        $email   = $this->resolveEmail($payload, $dto);
        $name    = $this->resolveName($payload, $dto, $email);

        if ($appleId === '') {
            throw ValidationException::withMessages([
                'id_token' => ['Apple sign-in failed. Please try again.'],
            ]);
        }

        $user = $this->findOrCreateUser($appleId, $email, $name);

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
     * @return array<string, mixed>
     */
    private function verifyIdentityToken(string $idToken): array
    {
        $parts = explode('.', $idToken);
        if (count($parts) !== 3) {
            throw ValidationException::withMessages([
                'id_token' => ['Apple sign-in failed. Please try again.'],
            ]);
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;

        $header  = $this->decodeJwtPart($encodedHeader);
        $payload = $this->decodeJwtPart($encodedPayload);
        $kid     = (string) ($header['kid'] ?? '');
        $alg     = (string) ($header['alg'] ?? '');

        if ($kid === '' || $alg !== 'RS256') {
            throw ValidationException::withMessages([
                'id_token' => ['Apple sign-in failed. Please try again.'],
            ]);
        }

        $pem = $this->findApplePublicKeyPem($kid);
        $signature = $this->base64UrlDecode($encodedSignature);
        $signedData = $encodedHeader . '.' . $encodedPayload;

        $verified = openssl_verify($signedData, $signature, $pem, OPENSSL_ALGO_SHA256);
        if ($verified !== 1) {
            throw ValidationException::withMessages([
                'id_token' => ['Apple sign-in failed. Please try again.'],
            ]);
        }

        $issuer   = (string) ($payload['iss'] ?? '');
        $audience = (string) ($payload['aud'] ?? '');
        $expires  = (int) ($payload['exp'] ?? 0);

        if (
            $issuer !== self::APPLE_ISSUER ||
            $audience !== (string) config('services.apple.client_id') ||
            $expires <= now()->timestamp
        ) {
            throw ValidationException::withMessages([
                'id_token' => ['Apple sign-in failed. Please try again.'],
            ]);
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    private function decodeJwtPart(string $part): array
    {
        $json = $this->base64UrlDecode($part);
        $decoded = json_decode($json, true);

        if (! is_array($decoded)) {
            throw ValidationException::withMessages([
                'id_token' => ['Apple sign-in failed. Please try again.'],
            ]);
        }

        return $decoded;
    }

    private function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder > 0) {
            $data .= str_repeat('=', 4 - $remainder);
        }

        $decoded = base64_decode(strtr($data, '-_', '+/'), true);

        if ($decoded === false) {
            throw ValidationException::withMessages([
                'id_token' => ['Apple sign-in failed. Please try again.'],
            ]);
        }

        return $decoded;
    }

    private function findApplePublicKeyPem(string $kid): string
    {
        /** @var array<int, array<string, mixed>> $keys */
        $keys = Cache::remember(self::JWKS_CACHE_KEY, now()->addHours(6), function (): array {
            $response = Http::timeout(10)->acceptJson()->get(self::APPLE_ISSUER . '/auth/keys');

            if (! $response->ok()) {
                throw ValidationException::withMessages([
                    'id_token' => ['Apple sign-in failed. Please try again.'],
                ]);
            }

            return $response->json('keys', []);
        });

        foreach ($keys as $key) {
            if (($key['kid'] ?? null) === $kid && ($key['kty'] ?? null) === 'RSA') {
                return $this->jwkToPem((string) $key['n'], (string) $key['e']);
            }
        }

        throw ValidationException::withMessages([
            'id_token' => ['Apple sign-in failed. Please try again.'],
        ]);
    }

    private function jwkToPem(string $modulus, string $exponent): string
    {
        $mod = $this->ensurePositiveInteger($this->base64UrlDecode($modulus));
        $exp = $this->ensurePositiveInteger($this->base64UrlDecode($exponent));

        $rsaPublicKey = $this->asn1Sequence(
            $this->asn1Integer($mod) .
            $this->asn1Integer($exp)
        );

        $algorithmIdentifier = hex2bin('300d06092a864886f70d0101010500');
        if ($algorithmIdentifier === false) {
            throw ValidationException::withMessages([
                'id_token' => ['Apple sign-in failed. Please try again.'],
            ]);
        }

        $subjectPublicKeyInfo = $this->asn1Sequence(
            $algorithmIdentifier .
            $this->asn1BitString($rsaPublicKey)
        );

        return "-----BEGIN PUBLIC KEY-----\n"
            . chunk_split(base64_encode($subjectPublicKeyInfo), 64, "\n")
            . "-----END PUBLIC KEY-----\n";
    }

    private function ensurePositiveInteger(string $value): string
    {
        return (ord($value[0]) > 0x7f) ? "\x00" . $value : $value;
    }

    private function asn1Integer(string $value): string
    {
        return "\x02" . $this->asn1Length(strlen($value)) . $value;
    }

    private function asn1Sequence(string $value): string
    {
        return "\x30" . $this->asn1Length(strlen($value)) . $value;
    }

    private function asn1BitString(string $value): string
    {
        return "\x03" . $this->asn1Length(strlen($value) + 1) . "\x00" . $value;
    }

    private function asn1Length(int $length): string
    {
        if ($length < 128) {
            return chr($length);
        }

        $temp = ltrim(pack('N', $length), "\x00");
        return chr(0x80 | strlen($temp)) . $temp;
    }

    /**
     * @param array<string, mixed> $payload
     */
    private function resolveEmail(array $payload, AppleAuthDTO $dto): ?string
    {
        $email = $payload['email'] ?? $dto->email;

        return is_string($email) && $email !== '' ? $email : null;
    }

    /**
     * @param array<string, mixed> $payload
     */
    private function resolveName(array $payload, AppleAuthDTO $dto, ?string $email): string
    {
        $name = $dto->name;

        if ($name === null || $name === '') {
            $tokenName = $payload['name'] ?? null;
            $name = is_string($tokenName) && $tokenName !== '' ? $tokenName : null;
        }

        return $name ?? $email ?? 'Apple User';
    }

    private function findOrCreateUser(string $appleId, string $email, string $name): User
    {
        $user = User::withTrashed()->where('apple_id', $appleId)->first();

        if ($user !== null) {
            if ($user->trashed()) {
                $user->restore();
            }

            if ($email !== null && $user->email !== $email) {
                $user->update([
                    'email' => $email,
                    'name'  => $name,
                ]);
                return $user->fresh();
            }

            return $user;
        }

        if ($email === null) {
            throw ValidationException::withMessages([
                'id_token' => ['Apple sign-in failed. Please try again.'],
            ]);
        }

        $user = User::where('email', $email)->first();

        if ($user !== null) {
            $user->update(['apple_id' => $appleId]);
            return $user;
        }

        return User::create([
            'apple_id' => $appleId,
            'email'    => $email,
            'name'     => $name,
            'password' => null,
        ]);
    }
}
