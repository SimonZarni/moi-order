<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates profile update only.
 * Principle: Security — authorize() confirms the requester is the authenticated user.
 */
class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email,' . $this->user()?->id],
            'phone_number'  => ['nullable', 'string', 'max:20', 'unique:users,phone_number,' . $this->user()?->id],
            'date_of_birth' => ['nullable', 'date', 'date_format:Y-m-d', 'before:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'          => 'Full name is required.',
            'email.required'         => 'Email address is required.',
            'email.email'            => 'Email address must be valid.',
            'email.unique'           => 'This email address is already in use.',
            'phone_number.unique'    => 'This phone number is already in use.',
            'name.max'               => 'Full name must not exceed 255 characters.',
            'date_of_birth.date'     => 'Date of birth must be a valid date.',
            'date_of_birth.before'   => 'Date of birth must be in the past.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name'          => 'full name',
            'email'         => 'email address',
            'phone_number'  => 'phone number',
            'date_of_birth' => 'date of birth',
        ];
    }
}
