<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRolePermissionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // check.permission:admins.manage middleware guards the route.
    }

    /** @return array<string,mixed> */
    public function rules(): array
    {
        return [
            'permission_keys'   => ['required', 'array'],
            'permission_keys.*' => ['required', 'string', Rule::exists('permissions', 'key')],
        ];
    }

    /** @return array<string,string> */
    public function messages(): array
    {
        return [
            'permission_keys.*.exists' => 'One or more permission keys are invalid.',
        ];
    }

    /** @return array<string,string> */
    public function attributes(): array
    {
        return [
            'permission_keys' => 'permissions',
        ];
    }
}
