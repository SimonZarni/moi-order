<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validation + authorisation for create/update KYC application info.
 * Principle: Validation — explicit rules, messages, attributes on every request.
 */
class CreateKycApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        // auth:sanctum + abilities:merchant + merchant.auth middleware already confirmed.
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'business_name'    => ['required', 'string', 'max:255'],
            'business_type'    => ['required', 'string', 'max:100'],
            'business_address' => ['required', 'string', 'max:1000'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'business_name.required'    => 'Business name is required.',
            'business_name.max'         => 'Business name may not exceed 255 characters.',
            'business_type.required'    => 'Business type is required.',
            'business_type.max'         => 'Business type may not exceed 100 characters.',
            'business_address.required' => 'Business address is required.',
            'business_address.max'      => 'Business address may not exceed 1000 characters.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'business_name'    => 'business name',
            'business_type'    => 'business type',
            'business_address' => 'business address',
        ];
    }
}
