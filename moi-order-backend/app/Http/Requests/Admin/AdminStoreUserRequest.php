<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminStoreUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'string', 'email:rfc', 'max:255', Rule::unique('users', 'email')],
            'password'      => ['required', 'string', 'min:8', 'max:255'],
            'date_of_birth' => ['sometimes', 'nullable', 'date', 'before:today'],
            'is_admin'      => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique'    => 'A user with this email address already exists.',
            'password.min'    => 'Password must be at least 8 characters.',
        ];
    }

    public function attributes(): array
    {
        return [
            'date_of_birth' => 'date of birth',
            'is_admin'      => 'admin status',
        ];
    }
}
