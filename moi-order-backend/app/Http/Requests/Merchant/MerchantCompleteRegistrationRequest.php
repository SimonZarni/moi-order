<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class MerchantCompleteRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'string', 'email:rfc', 'max:255'],
            'password'       => ['required', 'string', Password::min(8)->mixedCase()->numbers(), 'max:255'],
            'verified_token' => ['required', 'string', 'uuid'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'verified_token.uuid' => 'Invalid verification token.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'name'           => 'full name',
            'email'          => 'email address',
            'password'       => 'password',
            'verified_token' => 'verification token',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge(['email' => strtolower(trim($this->string('email')->toString()))]);
    }
}
