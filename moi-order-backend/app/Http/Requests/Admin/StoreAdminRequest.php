<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ensure.super_admin middleware guards the route.
    }

    /** @return array<string,mixed> */
    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'string', 'email:rfc,dns', 'max:255', Rule::unique('users', 'email')],
            'password'       => ['required', 'string', 'min:8', 'max:255'],
            'verified_token' => ['required', 'string', 'uuid'],
        ];
    }

    /** @return array<string,string> */
    public function messages(): array
    {
        return [
            'verified_token.required' => 'Email verification is required. Please verify the OTP first.',
        ];
    }

    /** @return array<string,string> */
    public function attributes(): array
    {
        return [
            'verified_token' => 'email verification token',
        ];
    }
}
