<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates OTP + new password for the email verification confirm step.
 */
class MerchantVerifyEmailConfirmRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // auth:sanctum middleware handles authentication
    }

    public function rules(): array
    {
        return [
            'otp'                   => ['required', 'string', 'digits:6'],
            'password'              => ['required', 'string', 'min:8', 'max:255'],
            'password_confirmation' => ['required', 'string', 'same:password'],
        ];
    }

    public function attributes(): array
    {
        return [
            'otp'                   => 'verification code',
            'password'              => 'new password',
            'password_confirmation' => 'password confirmation',
        ];
    }

    public function messages(): array
    {
        return [
            'otp.digits'                    => 'The verification code must be exactly 6 digits.',
            'password.min'                  => 'Your new password must be at least 8 characters.',
            'password_confirmation.same'    => 'The password confirmation does not match.',
        ];
    }
}
