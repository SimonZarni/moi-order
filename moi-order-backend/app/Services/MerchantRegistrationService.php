<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminCreateMerchantDTO;
use App\DTOs\SelfRegisterMerchantDTO;
use App\Enums\KycApplicationStatus;
use App\Models\KycApplication;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns admin-initiated merchant account creation only.
 * Principle: Security — password stored via User model's 'hashed' cast (bcrypt, cost≥12).
 *   Admin-created merchants skip KYC document upload; application created pre-approved.
 * Principle: DB::transaction — two-table write (users + kyc_applications).
 */
class MerchantRegistrationService
{
    /**
     * Self-registration: user creates their own merchant account.
     * is_merchant stays false until KYC is approved.
     * Token issued with 'merchant' ability so the app can reach KYC routes.
     *
     * @return array{user: User, token: string}
     */
    public function selfRegister(SelfRegisterMerchantDTO $dto): array
    {
        return DB::transaction(function () use ($dto): array {
            $user = User::create([
                'name'        => $dto->name,
                'email'       => $dto->email,
                'password'    => $dto->password,
                'is_merchant' => false,
            ]);

            $token = $user->createToken(
                'merchant-self-reg',
                ['merchant'],
                now()->addDays(30)
            )->plainTextToken;

            return ['user' => $user, 'token' => $token];
        });
    }

    /**
     * Admin directly creates a merchant with a pre-approved KYC application.
     * No KYC documents required (admin vouches for the merchant).
     *
     * @param  User  $admin  The acting admin user (stored as reviewer).
     * @return array{user: User, token: string}
     */
    public function adminCreateMerchant(AdminCreateMerchantDTO $dto, User $admin): array
    {
        return DB::transaction(function () use ($dto, $admin): array {
            $user = User::create([
                'name'        => $dto->name,
                'email'       => $dto->email,
                'password'    => $dto->password,
                'is_merchant' => true,
            ]);

            KycApplication::create([
                'user_id'          => $user->id,
                'business_name'    => $dto->businessName,
                'business_type'    => $dto->businessType,
                'business_address' => $dto->businessAddress,
                'status'           => KycApplicationStatus::Approved,
                'reviewed_by'      => $admin->id,
                'reviewed_at'      => now(),
                'submitted_at'     => now(),
            ]);

            $token = $user->createToken(
                'merchant-admin-auth',
                ['merchant'],
                now()->addDays(30)
            )->plainTextToken;

            return ['user' => $user, 'token' => $token];
        });
    }
}
