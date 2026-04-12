<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

/**
 * Principle: SRP — validates password change only.
 * Security: current_password hash check happens here (validation concern, not domain rule).
 *   Wrong current password → 422, not 409.
 */
class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'current_password'      => ['required', 'string'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string'],
        ];
    }

    public function withValidator(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        $validator->after(function ($v): void {
            if (!Hash::check((string) $this->input('current_password'), (string) $this->user()->password)) {
                $v->errors()->add('current_password', 'The current password is incorrect.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'password.min'       => 'New password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }

    public function attributes(): array
    {
        return [
            'current_password' => 'current password',
            'password'         => 'new password',
        ];
    }
}
