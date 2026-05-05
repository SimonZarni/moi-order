<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmailOtpVerifyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'otp_request_id' => ['required', 'string', 'uuid'],
            'email'          => ['required', 'string', 'email:rfc', 'max:255'],
            'code'           => ['required', 'string', 'digits:6'],
            'purpose'        => ['required', Rule::in(['login', 'register'])],
            'name'           => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.digits' => 'The verification code must be exactly 6 digits.',
        ];
    }

    public function attributes(): array
    {
        return [
            'otp_request_id' => 'OTP request ID',
            'email'          => 'email address',
            'code'           => 'verification code',
        ];
    }
}
