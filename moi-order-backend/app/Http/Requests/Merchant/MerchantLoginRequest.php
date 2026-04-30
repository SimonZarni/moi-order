<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class MerchantLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public — credentials ARE the authorisation
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email:rfc,dns', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'email.required'    => 'Email address is required.',
            'email.email'       => 'Please enter a valid email address.',
            'password.required' => 'Password is required.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'email'    => 'email address',
            'password' => 'password',
        ];
    }
}
