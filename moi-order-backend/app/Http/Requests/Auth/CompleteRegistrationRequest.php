<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class CompleteRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public
    }

    public function rules(): array
    {
        return [
            'email'          => ['required', 'string', 'email:rfc', 'max:255'],
            'name'           => ['required', 'string', 'min:2', 'max:255'],
            'password'       => ['required', 'string', 'min:8', 'max:255', 'confirmed'],
            'verified_token' => ['required', 'string', 'uuid'],
        ];
    }

    public function messages(): array
    {
        return [
            'password.confirmed' => 'The passwords do not match.',
            'password.min'       => 'Password must be at least 8 characters.',
            'name.min'           => 'Full name must be at least 2 characters.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name'           => 'full name',
            'verified_token' => 'verification token',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge(['email' => strtolower(trim($this->string('email')->toString()))]);
    }
}
