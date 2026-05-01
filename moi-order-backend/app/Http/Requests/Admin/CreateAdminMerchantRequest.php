<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rules\Unique;

/**
 * Principle: SRP — validation for admin-initiated merchant account creation.
 * Principle: Security — email uniqueness checked at DB level; password min:8.
 */
class CreateAdminMerchantRequest extends FormRequest
{
    public function authorize(): bool
    {
        // admin.auth middleware already asserts is_admin.
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'string', 'email:rfc,dns', 'max:255', (new Unique('users', 'email'))->withoutTrashed()],
            'password'         => ['required', 'string', 'min:8', 'max:255'],
            'business_name'    => ['required', 'string', 'max:255'],
            'business_type'    => ['required', 'string', 'max:100'],
            'business_address' => ['required', 'string', 'max:1000'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required'             => 'Name is required.',
            'email.required'            => 'Email address is required.',
            'email.email'               => 'Email address must be a valid email.',
            'email.unique'              => 'This email address is already registered.',
            'password.required'         => 'Password is required.',
            'password.min'              => 'Password must be at least 8 characters.',
            'business_name.required'    => 'Business name is required.',
            'business_type.required'    => 'Business type is required.',
            'business_address.required' => 'Business address is required.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'name'             => 'name',
            'email'            => 'email address',
            'password'         => 'password',
            'business_name'    => 'business name',
            'business_type'    => 'business type',
            'business_address' => 'business address',
        ];
    }
}
