<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Validator;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<string>> */
    public function rules(): array
    {
        return [
            'current_password'          => ['required', 'string'],
            'new_password'              => ['required', 'string', 'min:8', 'max:255'],
            'new_password_confirmation' => ['required', 'string', 'same:new_password'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            /** @var \App\Models\User $user */
            $user = $this->user();
            if (
                empty($user->password)
                || ! Hash::check((string) $this->input('current_password'), (string) $user->password)
            ) {
                $v->errors()->add('current_password', 'The current password is incorrect.');
            }
        });
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'new_password.min'               => 'New password must be at least 8 characters.',
            'new_password_confirmation.same' => 'Password confirmation does not match.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'current_password'          => 'current password',
            'new_password'              => 'new password',
            'new_password_confirmation' => 'password confirmation',
        ];
    }
}
