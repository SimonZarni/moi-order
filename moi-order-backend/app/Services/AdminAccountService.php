<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreateAdminAccountDTO;
use App\DTOs\SendEmailOtpDTO;
use App\DTOs\VerifyEmailOtpDTO;
use App\Enums\EmailOtpPurpose;
use App\Enums\UserStatusEnum;
use App\Exceptions\DomainException;
use App\Models\AdminRole;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminAccountService
{
    public function __construct(private readonly EmailOtpService $otpService) {}

    /** @return array{expires_in: int, resend_after: int} */
    public function sendOtp(string $email): array
    {
        return $this->otpService->send(new SendEmailOtpDTO(
            email:   $email,
            purpose: EmailOtpPurpose::AdminInvite,
        ));
    }

    public function verifyOtp(string $email, string $otp): string
    {
        return $this->otpService->verify(new VerifyEmailOtpDTO(
            email:   $email,
            purpose: EmailOtpPurpose::AdminInvite,
            otp:     $otp,
        ));
    }

    public function create(CreateAdminAccountDTO $dto): User
    {
        $this->otpService->consumeVerifiedToken($dto->email, $dto->verifiedToken, EmailOtpPurpose::AdminInvite);

        $adminRole = AdminRole::where('slug', 'admin')->first();

        if ($adminRole === null) {
            throw new DomainException('admin_role.not_seeded', 500);
        }

        return DB::transaction(function () use ($dto, $adminRole): User {
            return User::create([
                'name'          => $dto->name,
                'email'         => $dto->email,
                'password'      => $dto->password,
                'is_admin'      => true,
                'admin_role_id' => $adminRole->id,
                'status'        => UserStatusEnum::Active,
            ]);
        });
    }

    /**
     * @param array{name?:string,email?:string,admin_role_id?:int} $data
     */
    public function update(User $user, array $data): void
    {
        $user->update(array_filter(
            $data,
            static fn (mixed $v): bool => $v !== null,
        ));
    }

    /**
     * Flip is_admin flag. Existing tokens are rejected by AdminAuthenticate on next request.
     */
    public function toggle(User $user): void
    {
        $user->update(['is_admin' => ! $user->is_admin]);
    }

    /**
     * Revoke admin access and soft-delete the user record.
     */
    public function delete(User $user): void
    {
        $user->update(['is_admin' => false, 'admin_role_id' => null]);
        $user->delete();
    }
}
