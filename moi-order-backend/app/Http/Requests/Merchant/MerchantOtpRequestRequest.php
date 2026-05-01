<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validation for merchant OTP request.
 */
class MerchantOtpRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        // intentionally public — no auth required to request an OTP
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'phone_number' => ['required', 'string', 'max:20'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'phone_number.required' => 'Phone number is required.',
            'phone_number.max'      => 'Phone number may not exceed 20 characters.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'phone_number' => 'phone number',
        ];
    }
}
