<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\ChangePasswordDTO;
use App\DTOs\UpdateProfileDTO;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Principle: SRP — profile domain only (update info, change password).
 * Principle: DIP — receives typed DTOs; never touches Request objects.
 * Security: changePassword() revokes all other tokens — forces re-auth on other devices.
 */
class ProfileService
{
    public function updateProfile(User $user, UpdateProfileDTO $dto): User
    {
        $user->update([
            'name'          => $dto->name,
            'date_of_birth' => $dto->dateOfBirth,
        ]);

        return $user->fresh();
    }

    public function changePassword(User $user, ChangePasswordDTO $dto): void
    {
        $user->update(['password' => Hash::make($dto->newPassword)]);

        // Revoke all other active tokens — any session on another device must re-authenticate.
        $currentTokenId = $user->currentAccessToken()->id;
        $user->tokens()->where('id', '!=', $currentTokenId)->delete();
    }
}
