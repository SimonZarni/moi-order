<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validation for merchant OTP verification.
 */
class MerchantOtpVerifyRequest extends FormRequest
{
    public function authorize(): bool
    {
        // intentionally public — no auth required to verify an OTP
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'otp_request_id' => ['required', 'string', 'uuid'],
            'phone_number'   => ['required', 'string', 'max:20'],
            'pin'            => ['required', 'string', 'max:10'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'otp_request_id.required' => 'OTP request ID is required.',
            'otp_request_id.uuid'     => 'OTP request ID must be a valid UUID.',
            'phone_number.required'   => 'Phone number is required.',
            'pin.required'            => 'PIN is required.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'otp_request_id' => 'OTP request ID',
            'phone_number'   => 'phone number',
            'pin'            => 'OTP pin',
        ];
    }
}
