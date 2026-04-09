<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public
    }

    public function rules(): array
    {
        return [
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password'              => ['required', 'string', 'confirmed', Password::min(8)],
            'password_confirmation' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique'              => 'An account with this email already exists.',
            'password.confirmed'        => 'Passwords do not match.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name'                  => 'full name',
            'email'                 => 'email address',
            'password'              => 'password',
            'password_confirmation' => 'password confirmation',
        ];
    }
}
