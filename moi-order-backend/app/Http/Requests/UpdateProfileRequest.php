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

    public function prepareForValidation(): void
    {
        if ($this->has('name')) {
            $this->merge(['name' => strip_tags(trim((string) $this->input('name')))]);
        }

        // Strip leading @ so users can type "@chrisline" or "chrisline" — both are accepted.
        if ($this->has('line_handle') && $this->input('line_handle') !== null) {
            $this->merge(['line_handle' => ltrim(trim((string) $this->input('line_handle')), '@')]);
        }
    }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email,' . $this->user()?->id],
            'phone_number'  => ['nullable', 'string', 'max:20', 'unique:users,phone_number,' . $this->user()?->id],
            'date_of_birth' => ['nullable', 'date', 'date_format:Y-m-d', 'before:today'],
            // LINE ID: 4–20 chars, letters / numbers / . _ - only (LINE's own rules).
            // Uniqueness ignores the current user so they can re-save without conflict.
            'line_handle'   => ['nullable', 'string', 'min:4', 'max:20', 'regex:/^[a-zA-Z0-9._\-]+$/', 'unique:users,line_handle,' . $this->user()?->id],
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
            'line_handle.min'        => 'LINE ID must be at least 4 characters.',
            'line_handle.max'        => 'LINE ID must not exceed 20 characters.',
            'line_handle.regex'      => 'LINE ID may only contain letters, numbers, periods, hyphens, and underscores.',
            'line_handle.unique'     => 'This LINE ID is already in use by another account.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name'          => 'full name',
            'email'         => 'email address',
            'phone_number'  => 'phone number',
            'date_of_birth' => 'date of birth',
            'line_handle'   => 'LINE ID',
        ];
    }
}
