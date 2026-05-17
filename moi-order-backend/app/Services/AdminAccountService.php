<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreateAdminAccountDTO;
use App\DTOs\CreateAdminDirectDTO;
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

    public function createDirect(CreateAdminDirectDTO $dto): User
    {
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
     *
     * Security rules enforced here (not in middleware) because only the service
     * has enough context to evaluate both the caller and the target together:
     *
     * 1. Self-update blocked — an admin cannot change their own role.
     *    Prevents self-promotion regardless of what permissions they hold.
     *
     * 2. Super-admin role assignment restricted — only a super_admin can promote
     *    another account to super_admin. Prevents privilege escalation via
     *    admins.manage permission.
     */
    public function update(User $caller, User $target, array $data): void
    {
        if ($caller->id === $target->id) {
            throw new DomainException('admins.cannot_update_own_account', 403);
        }

        if (isset($data['admin_role_id'])) {
            $role = AdminRole::find($data['admin_role_id']);
            if ($role?->slug === 'super_admin' && ! $caller->isSuperAdmin()) {
                throw new DomainException('admins.cannot_assign_super_admin_role', 403);
            }
        }

        $target->update(array_filter(
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
