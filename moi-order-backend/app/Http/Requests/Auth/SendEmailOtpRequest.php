<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Enums\EmailOtpPurpose;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SendEmailOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public
    }

    public function rules(): array
    {
        return [
            'email'   => ['required', 'string', 'email:rfc,dns', 'max:255'],
            'purpose' => ['required', 'string', Rule::enum(EmailOtpPurpose::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Please enter a valid email address.',
        ];
    }

    public function attributes(): array
    {
        return [
            'email'   => 'email address',
            'purpose' => 'request purpose',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge(['email' => strtolower(trim($this->string('email')->toString()))]);
    }
}
