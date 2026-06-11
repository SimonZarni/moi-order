<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminCreateMerchantDTO;
use App\DTOs\SelfRegisterMerchantDTO;
use App\Enums\KycApplicationStatus;
use App\Enums\KycDocumentType;
use App\Models\KycApplication;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — owns merchant account creation only.
 * Principle: DIP — KycService injected for document upload, never called directly.
 * Principle: Security — password stored via User model's 'hashed' cast (bcrypt, cost≥12).
 * Principle: DB::transaction — covers User + KycApplication writes only.
 *   Document file uploads happen outside the transaction (file writes are not rollback-able).
 *   If a document upload fails, the merchant account is still created; admin can re-upload manually.
 */
class MerchantRegistrationService
{
    public function __construct(
        private readonly KycService $kycService,
        private readonly MenuService $menuService,
    ) {}

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

            // Create a draft KYC application immediately so that:
            // (a) login can verify this is a merchant-registered account, and
            // (b) the KYC wizard can always find or use this record.
            KycApplication::create([
                'user_id'          => $user->id,
                'business_name'    => '',
                'business_type'    => '',
                'business_address' => '',
                'status'           => KycApplicationStatus::Draft,
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
     * Documents are optional — admin vouches for the merchant, but files are stored if provided.
     * Document uploads run outside the DB transaction: file writes cannot be rolled back,
     * and a failed upload must not undo the already-committed user/KYC records.
     *
     * @param  User  $admin  The acting admin user (stored as reviewer).
     * @return array{user: User, token: string}
     */
    public function adminCreateMerchant(AdminCreateMerchantDTO $dto, User $admin): array
    {
        /** @var array{user: User, token: string, app: KycApplication} $result */
        $result = DB::transaction(function () use ($dto, $admin): array {
            $user = User::create([
                'name'        => $dto->name,
                'email'       => $dto->email,
                'password'    => $dto->password,
                'is_merchant' => true,
            ]);

            $app = KycApplication::create([
                'user_id'          => $user->id,
                'business_name'    => $dto->businessName,
                'business_type'    => $dto->businessType,
                'business_address' => $dto->businessAddress,
                'business_phone'   => $dto->businessPhone,
                'status'           => KycApplicationStatus::Approved,
                'reviewed_by'      => $admin->id,
                'reviewed_at'      => now(),
                'submitted_at'     => now(),
            ]);

            // Mirror KycApplication::approve() — create the restaurant immediately
            // so the merchant portal shows data without needing a separate KYC approval step.
            $restaurant = Restaurant::create([
                'user_id' => $user->id,
                'name'    => $dto->businessName,
                'address' => $dto->businessAddress,
                'phone'   => $dto->businessPhone,
            ]);

            $this->menuService->createSystemCategoriesForRestaurant($restaurant);

            $token = $user->createToken(
                'merchant-admin-auth',
                ['merchant'],
                now()->addDays(30)
            )->plainTextToken;

            return ['user' => $user, 'token' => $token, 'app' => $app];
        });

        // Upload documents outside the transaction — file writes are not rollback-able.
        foreach ($dto->documentFiles as $typeString => $file) {
            try {
                $this->kycService->uploadDocument(
                    $result['app'],
                    $file,
                    KycDocumentType::from($typeString),
                );
            } catch (\Throwable $e) {
                Log::warning('Admin merchant document upload failed after account creation', [
                    'kyc_application_id' => $result['app']->id,
                    'document_type'      => $typeString,
                    'error'              => $e->getMessage(),
                ]);
            }
        }

        return ['user' => $result['user'], 'token' => $result['token']];
    }
}
