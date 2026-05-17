<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SendAdminOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ensure.super_admin middleware guards the route.
    }

    /** @return array<string,mixed> */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255', Rule::unique('users', 'email')->where('is_admin', true)],
        ];
    }

    /** @return array<string,string> */
    public function messages(): array
    {
        return [
            'email.unique' => 'This email already has an admin account.',
        ];
    }
}
