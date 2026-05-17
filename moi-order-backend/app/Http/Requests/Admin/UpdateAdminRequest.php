<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // check.permission:admins.manage middleware guards the route.
    }

    /** @return array<string,mixed> */
    public function rules(): array
    {
        return [
            'name'          => ['sometimes', 'required', 'string', 'max:255'],
            'email'         => ['sometimes', 'required', 'string', 'email:rfc,dns', 'max:255', Rule::unique('users', 'email')->ignore($this->route('id'), 'uuid')],
            'admin_role_id' => ['sometimes', 'required', 'integer', Rule::exists('admin_roles', 'id')],
        ];
    }

    /** @return array<string,string> */
    public function messages(): array
    {
        return [
            'admin_role_id.exists' => 'The selected role does not exist.',
        ];
    }

    /** @return array<string,string> */
    public function attributes(): array
    {
        return [
            'admin_role_id' => 'role',
        ];
    }
}
