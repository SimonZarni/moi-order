<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUpdateUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;

        return [
            'name'          => ['sometimes', 'string', 'max:255'],
            'email'         => ['sometimes', 'nullable', 'string', 'email:rfc', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'phone_number'  => ['sometimes', 'nullable', 'string', 'max:20', Rule::unique('users', 'phone_number')->ignore($userId)],
            'password'      => ['sometimes', 'nullable', 'string', 'min:8', 'max:255'],
            'date_of_birth' => ['sometimes', 'nullable', 'date', 'before:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique'        => 'A user with this email address already exists.',
            'phone_number.unique' => 'A user with this phone number already exists.',
            'password.min'        => 'Password must be at least 8 characters.',
        ];
    }

    public function attributes(): array
    {
        return [
            'date_of_birth' => 'date of birth',
            'phone_number'  => 'phone number',
        ];
    }
}
