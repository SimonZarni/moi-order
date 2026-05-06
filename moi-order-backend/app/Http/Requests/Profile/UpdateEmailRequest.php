<?php

declare(strict_types=1);

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                'email:rfc,dns',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->user()->id),
            ],
            'otp' => ['required', 'string', 'digits:6'],
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge(['email' => strtolower(trim($this->string('email')->toString()))]);
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'email.required' => 'Email address is required.',
            'email.email'    => 'Email address must be valid.',
            'email.max'      => 'Email address is too long.',
            'email.unique'   => 'This email is already in use by another account.',
            'otp.required'   => 'Verification code is required.',
            'otp.digits'     => 'Verification code must be 6 digits.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'email' => 'email address',
            'otp'   => 'verification code',
        ];
    }
}
