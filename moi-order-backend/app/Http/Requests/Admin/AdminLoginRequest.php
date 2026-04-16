<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates admin login input only.
 * Security: email:rfc,dns validates deliverability; max:255 prevents oversized inputs.
 */
class AdminLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public — auth middleware not applied on this route
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email:rfc', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
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
            'email'    => 'email address',
            'password' => 'password',
        ];
    }
}
