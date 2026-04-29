<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\ChangePasswordDTO;
use App\DTOs\UpdateProfileDTO;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Principle: SRP — profile domain only (update info, change password).
 * Principle: DIP — receives typed DTOs; never touches Request objects.
 * Security: changePassword() revokes all other tokens — forces re-auth on other devices.
 */
class ProfileService
{
    public function __construct(
        private readonly FileStorageInterface $fileStorage,
    ) {}

    public function uploadProfilePicture(User $user, UploadedFile $file): User
    {
        if ($user->profile_picture_path !== null) {
            $this->fileStorage->delete($user->profile_picture_path);
        }

        $path = $this->fileStorage->store($file, 'profile-pictures');
        $user->update(['profile_picture_path' => $path]);

        return $user->fresh();
    }

    public function removeProfilePicture(User $user): User
    {
        if ($user->profile_picture_path !== null) {
            $this->fileStorage->delete($user->profile_picture_path);
            $user->update(['profile_picture_path' => null]);
        }

        return $user->fresh();
    }

    public function updateProfile(User $user, UpdateProfileDTO $dto): User
    {
        $phoneNumber = $dto->phoneNumber !== null && trim($dto->phoneNumber) !== ''
            ? $this->normalizeThaiPhoneNumber($dto->phoneNumber)
            : null;

        $user->update([
            'name'          => $dto->name,
            'email'         => $dto->email,
            'phone_number'  => $phoneNumber,
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

    public function unlinkProvider(User $user, string $provider): User
    {
        $loginMethodCount = array_sum([
            $user->password !== null      ? 1 : 0,
            $user->google_id !== null     ? 1 : 0,
            $user->apple_id !== null      ? 1 : 0,
            $user->line_id !== null       ? 1 : 0,
            $user->phone_number !== null  ? 1 : 0,
        ]);

        if ($loginMethodCount <= 1) {
            throw new \DomainException('account.minimum_login_method');
        }

        $field = match ($provider) {
            'google' => 'google_id',
            'apple'  => 'apple_id',
            'line'   => 'line_id',
        };

        $user->update([$field => null]);

        return $user->fresh();
    }

    public function deleteAccount(User $user): void
    {
        DB::transaction(function () use ($user): void {
            // Anonymise PII before soft-deleting so the data cannot be recovered
            // even if soft-delete rows are later inspected.
            $user->update([
                'name'          => 'Deleted User',
                'email'         => 'deleted_' . $user->id . '@deleted.invalid',
                'phone_number'  => null,
                'date_of_birth' => null,
            ]);

            // Revoke all tokens — immediately invalidates every active session.
            $user->tokens()->delete();

            // Soft-delete the row — transactional records (orders, submissions)
            // retain their user_id FK but the user is no longer queryable.
            $user->delete();
        });
    }

    private function normalizeThaiPhoneNumber(string $phoneNumber): string
    {
        $digits = preg_replace('/\D+/', '', $phoneNumber) ?? '';

        if ($digits === '') {
            throw ValidationException::withMessages([
                'phone_number' => ['Phone number is required.'],
            ]);
        }

        if (str_starts_with($digits, '66') && strlen($digits) === 11) {
            return $digits;
        }

        if (str_starts_with($digits, '0') && strlen($digits) === 10) {
            return '66' . substr($digits, 1);
        }

        if (strlen($digits) === 9 && in_array($digits[0], ['6', '8', '9'], true)) {
            return '66' . $digits;
        }

        throw ValidationException::withMessages([
            'phone_number' => ['Enter a valid Thai mobile number.'],
        ]);
    }
}
