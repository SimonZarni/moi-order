<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\UserStatusEnum;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminAccountService
{
    /**
     * @param array{name:string,email:string,password:string,admin_role_id:int} $data
     */
    public function create(array $data): User
    {
        return User::create([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password'      => Hash::make($data['password']),
            'is_admin'      => true,
            'admin_role_id' => $data['admin_role_id'],
            'status'        => UserStatusEnum::Active,
        ]);
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
