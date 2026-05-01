<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // check.permission:admins.manage middleware guards the route.
    }

    /** @return array<string,mixed> */
    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'string', 'email:rfc,dns', 'max:255', Rule::unique('users', 'email')],
            'password'      => ['required', 'string', 'min:8', 'max:255'],
            'admin_role_id' => ['required', 'integer', Rule::exists('admin_roles', 'id')],
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
