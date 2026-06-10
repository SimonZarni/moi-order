<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validation + authorisation for business profile update.
 * Only business_phone is updatable post-approval; identity fields require resubmission.
 */
class UpdateBusinessProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'business_phone' => ['nullable', 'string', 'max:30'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'business_phone.max' => 'Business phone may not exceed 30 characters.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'business_phone' => 'business phone',
        ];
    }
}
