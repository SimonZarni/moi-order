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
            'date_of_birth' => ['nullable', 'date', 'date_format:Y-m-d', 'before:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'          => 'Full name is required.',
            'name.max'               => 'Full name must not exceed 255 characters.',
            'date_of_birth.date'     => 'Date of birth must be a valid date.',
            'date_of_birth.before'   => 'Date of birth must be in the past.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name'          => 'full name',
            'date_of_birth' => 'date of birth',
        ];
    }
}
