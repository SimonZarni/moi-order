<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'current_password'          => ['required', 'string'],
            'new_password'              => ['required', 'string', 'min:8', 'max:255'],
            'new_password_confirmation' => ['required', 'string', 'same:new_password'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'new_password_confirmation.same' => 'Password confirmation does not match.',
        ];
    }
}
