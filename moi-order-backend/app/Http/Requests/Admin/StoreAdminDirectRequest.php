<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdminDirectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ensure.super_admin middleware guards the route.
    }

    /** @return array<string,mixed> */
    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email:rfc,dns', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8', 'max:255'],
        ];
    }

    /** @return array<string,string> */
    public function messages(): array
    {
        return [];
    }

    /** @return array<string,string> */
    public function attributes(): array
    {
        return [];
    }
}
