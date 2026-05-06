<?php

declare(strict_types=1);

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePhoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'otp_request_id' => ['required', 'string', 'uuid'],
            'phone_number'   => ['required', 'string', 'max:20'],
            'otp'            => ['required', 'string', 'digits:6'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'otp_request_id.required' => 'OTP request ID is required.',
            'otp_request_id.uuid'     => 'OTP request ID is invalid.',
            'phone_number.required'   => 'Phone number is required.',
            'otp.required'            => 'Verification code is required.',
            'otp.digits'              => 'Verification code must be 6 digits.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'otp_request_id' => 'OTP request',
            'phone_number'   => 'phone number',
            'otp'            => 'verification code',
        ];
    }
}
