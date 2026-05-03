<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class AdminUpdateUserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // AdminAuthenticate middleware + check.permission guard this route
    }

    public function rules(): array
    {
        return [
            'role' => ['required', 'string', new Enum(UserRole::class)],
        ];
    }

    public function attributes(): array
    {
        return [
            'role' => 'user role',
        ];
    }

    public function messages(): array
    {
        return [
            'role.required' => 'A role is required.',
            'role.Illuminate\Validation\Rules\Enum' => 'The selected role is invalid.',
        ];
    }
}
