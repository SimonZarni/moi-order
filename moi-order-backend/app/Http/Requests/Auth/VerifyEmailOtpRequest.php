<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Enums\EmailOtpPurpose;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VerifyEmailOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public
    }

    public function rules(): array
    {
        return [
            'email'   => ['required', 'string', 'email:rfc', 'max:255'],
            'otp'     => ['required', 'string', 'digits:6'],
            'purpose' => ['required', 'string', Rule::enum(EmailOtpPurpose::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'otp.digits' => 'The verification code must be exactly 6 digits.',
        ];
    }

    public function attributes(): array
    {
        return [
            'email'   => 'email address',
            'otp'     => 'verification code',
            'purpose' => 'request purpose',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge(['email' => strtolower(trim($this->string('email')->toString()))]);
    }
}
