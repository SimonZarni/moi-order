<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AppleAuthDTO;
use App\DTOs\GoogleAuthDTO;
use App\DTOs\LineAuthDTO;
use App\Models\KycApplication;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

/**
 * Principle: SRP — owns social-auth login for the merchant dashboard only.
 * Principle: DIP — delegates identity verification to the existing provider services;
 *   never re-implements token validation logic.
 *
 * Flow: verify identity → find/create User (via provider service) → assert merchant
 *   access → issue ['merchant'] token and return.
 *
 * Security: merchant access is checked AFTER identity is verified to maintain
 *   consistent timing and prevent user-enumeration via timing differences.
 *   The provider services may create a short-lived 'user-auth' token as a side-effect;
 *   that token is immediately discarded — only the 'merchant' token is returned.
 */
class MerchantSocialAuthService
{
    public function __construct(
        private readonly GoogleAuthService $googleService,
        private readonly AppleAuthService  $appleService,
        private readonly LineAuthService   $lineService,
    ) {}

    /**
     * @return array{user: User, token: string}
     * @throws \Illuminate\Validation\ValidationException  on invalid provider token.
     * @throws AuthorizationException                      when user has no merchant access.
     */
    public function authenticateGoogle(GoogleAuthDTO $dto): array
    {
        $result = $this->googleService->authenticate($dto);
        return $this->issueMerchantToken($result['user']);
    }

    /**
     * @return array{user: User, token: string}
     */
    public function authenticateApple(AppleAuthDTO $dto): array
    {
        $result = $this->appleService->authenticate($dto, [
            (string) config('services.apple.merchant_client_id', 'com.moiorder.merchant'),
            (string) config('services.apple.merchant_web_client_id', 'com.moiorder.merchantweb'),
        ]);
        return $this->issueMerchantToken($result['user']);
    }

    /**
     * @return array{user: User, token: string}
     */
    public function authenticateLine(LineAuthDTO $dto): array
    {
        $result = $this->lineService->authenticate($dto);
        return $this->issueMerchantToken($result['user']);
    }

    /**
     * Assert merchant access, revoke the provider-issued user token, and issue
     * a 30-day merchant token.
     *
     * @return array{user: User, token: string}
     * @throws AuthorizationException
     */
    private function issueMerchantToken(User $user): array
    {
        // Revoke the user token the provider service just created (side-effect clean-up).
        $user->currentAccessToken()?->delete();

        $hasMerchantAccess = $user->isMerchant()
            || KycApplication::forUser($user->id)->exists();

        if (! $hasMerchantAccess) {
            throw new AuthorizationException('merchant.access_required');
        }

        if ($user->isRestricted()) {
            throw new AuthorizationException('account.suspended');
        }

        $token = $user->createToken('merchant-auth', ['merchant'], now()->addDays(30))->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }
}
