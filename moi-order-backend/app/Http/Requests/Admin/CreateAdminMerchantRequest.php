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
            'name'                            => ['required', 'string', 'max:255'],
            'email'                           => ['required', 'string', 'email:rfc,dns', 'max:255', (new Unique('users', 'email'))->withoutTrashed()],
            'password'                        => ['required', 'string', 'min:8', 'max:255'],
            'business_name'                   => ['required', 'string', 'max:255'],
            'business_type'                   => ['required', 'string', 'max:100'],
            'business_address'                => ['required', 'string', 'max:1000'],
            'business_phone'                  => ['nullable', 'string', 'max:50'],
            'documents'                       => ['nullable', 'array'],
            'documents.national_id'           => ['nullable', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:10240'],
            'documents.business_registration' => ['nullable', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:10240'],
            'documents.bank_book'             => ['nullable', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:10240'],
            'documents.storefront_photo'      => ['nullable', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:10240'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required'                            => 'Name is required.',
            'email.required'                           => 'Email address is required.',
            'email.email'                              => 'Email address must be a valid email.',
            'email.unique'                             => 'This email address is already registered.',
            'password.required'                        => 'Password is required.',
            'password.min'                             => 'Password must be at least 8 characters.',
            'business_name.required'                   => 'Business name is required.',
            'business_type.required'                   => 'Business type is required.',
            'business_address.required'                => 'Business address is required.',
            'business_phone.max'                       => 'Business phone may not exceed 50 characters.',
            'documents.national_id.mimes'              => 'National ID must be a JPG, PNG, or PDF.',
            'documents.national_id.max'                => 'National ID may not exceed 10 MB.',
            'documents.business_registration.mimes'    => 'Business registration must be a JPG, PNG, or PDF.',
            'documents.business_registration.max'      => 'Business registration may not exceed 10 MB.',
            'documents.bank_book.mimes'                => 'Bank book must be a JPG, PNG, or PDF.',
            'documents.bank_book.max'                  => 'Bank book may not exceed 10 MB.',
            'documents.storefront_photo.mimes'         => 'Storefront photo must be a JPG, PNG, or PDF.',
            'documents.storefront_photo.max'           => 'Storefront photo may not exceed 10 MB.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'name'                            => 'name',
            'email'                           => 'email address',
            'password'                        => 'password',
            'business_name'                   => 'business name',
            'business_type'                   => 'business type',
            'business_address'                => 'business address',
            'business_phone'                  => 'business phone',
            'documents.national_id'           => 'national ID',
            'documents.business_registration' => 'business registration',
            'documents.bank_book'             => 'bank book',
            'documents.storefront_photo'      => 'storefront photo',
        ];
    }
}
