<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\ChangePasswordDTO;
use App\DTOs\UpdateEmailDTO;
use App\DTOs\UpdatePhoneDTO;
use App\DTOs\UpdateProfileDTO;
use App\DTOs\VerifyEmailOtpDTO;
use App\Enums\DocumentType;
use App\Enums\EmailOtpPurpose;
use App\Exceptions\DomainException;
use App\Models\Document;
use App\Models\User;
use App\Notifications\NinetyDayReportReminderNotification;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
        private readonly OtpAuthService       $otpAuthService,
        private readonly EmailOtpService      $emailOtpService,
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
        $user->update(['password' => $dto->newPassword]);

        // Revoke all other active tokens — any session on another device must re-authenticate.
        $currentTokenId = $user->currentAccessToken()->id;
        $user->tokens()->where('id', '!=', $currentTokenId)->delete();
    }

    public function unlinkProvider(User $user, string $provider): User
    {
        $loginMethodCount = array_sum([
            $user->password !== null     ? 1 : 0,
            $user->google_id !== null    ? 1 : 0,
            $user->apple_id !== null     ? 1 : 0,
            $user->line_id !== null      ? 1 : 0,
            $user->phone_number !== null ? 1 : 0,
        ]);

        if ($loginMethodCount <= 1) {
            throw new DomainException('account.minimum_login_method', 409);
        }

        $field = match ($provider) {
            'google' => 'google_id',
            'apple'  => 'apple_id',
            'line'   => 'line_id',
        };

        $updates = [$field => null];

        // When removing a social provider that supplied the user's placeholder email,
        // and the user has no password set, clear the email so it shows as "—" in the
        // profile and prevents a stale social-domain address from lingering.
        if ($user->password === null && $this->isSocialPlaceholderEmail($user->email)) {
            $providerPrefix = match ($provider) {
                'google' => 'google_',
                'apple'  => 'apple_',
                'line'   => 'line_',
            };
            if (str_starts_with($user->email, $providerPrefix)) {
                $updates['email'] = null;
            }
        }

        $user->update($updates);

        return $user->fresh();
    }

    public function updatePhone(User $user, UpdatePhoneDTO $dto): User
    {
        $phoneNumber = $this->otpAuthService->verifyPhoneUpdate(
            $dto->otpRequestId,
            $dto->phoneNumber,
            $dto->otp,
            $user->id,
        );

        $user->update(['phone_number' => $phoneNumber]);

        return $user->fresh();
    }

    public function updateEmail(User $user, UpdateEmailDTO $dto): User
    {
        $verifyDto = new VerifyEmailOtpDTO(
            email:   $dto->email,
            otp:     $dto->otp,
            purpose: EmailOtpPurpose::EmailUpdate,
        );

        $verifiedToken = $this->emailOtpService->verify($verifyDto);
        $this->emailOtpService->consumeVerifiedToken($dto->email, $verifiedToken, EmailOtpPurpose::EmailUpdate);

        $user->update(['email' => $dto->email]);

        return $user->fresh();
    }

    /**
     * Finds the user's most recent valid 90-day document and force-sends the
     * reminder notification using effectiveDate() — bypasses the scheduler's
     * shouldNotify() gate so privileged users can test push delivery on demand.
     *
     * Returns an array for the controller to shape into a response:
     *   has_document  bool          — whether a 90-day doc was found
     *   sent          bool          — whether the notification was dispatched
     *   days_remaining int|null     — days until extension_date (negative = overdue)
     *   effective_date string|null  — the date used for the calculation
     */
    public function triggerNinetyDayReminder(User $user): array
    {
        $document = Document::query()
            ->where('user_id', $user->id)
            ->where('type', DocumentType::NinetyDayReport->value)
            ->where('is_valid_type', true)
            ->whereNotNull('extension_date')
            ->orderByDesc('extension_date')
            ->first();

        $deviceTokenCount = $user->deviceTokens()->count();

        if ($document === null) {
            return [
                'has_document'       => false,
                'sent'               => false,
                'days_remaining'     => null,
                'effective_date'     => null,
                'device_token_count' => $deviceTokenCount,
            ];
        }

        $effectiveDate = $user->effectiveDate();
        $daysRemaining = (int) $effectiveDate->diffInDays($document->extension_date, false);

        $user->notify(new NinetyDayReportReminderNotification($daysRemaining));

        Log::info('TriggerReminder: notification dispatched', [
            'user_id'            => $user->id,
            'effective_date'     => $effectiveDate->format('Y-m-d'),
            'extension_date'     => $document->extension_date->format('Y-m-d'),
            'days_remaining'     => $daysRemaining,
            'device_token_count' => $deviceTokenCount,
        ]);

        return [
            'has_document'       => true,
            'sent'               => true,
            'days_remaining'     => $daysRemaining,
            'effective_date'     => $effectiveDate->format('Y-m-d'),
            'device_token_count' => $deviceTokenCount,
        ];
    }

    public function updateSimulatedDate(User $user, ?string $date): User
    {
        $user->update(['simulated_date' => $date]);

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

    private function isSocialPlaceholderEmail(?string $email): bool
    {
        if ($email === null) {
            return false;
        }
        return str_ends_with($email, '@users.moiorder.local')
            || str_ends_with($email, '@deleted.invalid');
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
