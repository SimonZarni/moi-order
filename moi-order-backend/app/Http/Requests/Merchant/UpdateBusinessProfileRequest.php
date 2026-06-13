<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Principle: SRP — validation + authorisation for business profile update.
 * email uses `sometimes|required` so it is only validated when the client sends it.
 * unique rule ignores the authenticated user so they can save their current email.
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
            'email'          => [
                'sometimes', 'required', 'string', 'email:rfc,dns', 'max:255',
                Rule::unique('users', 'email')->ignore($this->user()->id),
            ],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'business_phone.max' => 'Business phone may not exceed 30 characters.',
            'email.required'     => 'Email address is required.',
            'email.email'        => 'Please enter a valid email address.',
            'email.max'          => 'Email address may not exceed 255 characters.',
            'email.unique'       => 'This email address is already in use.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'business_phone' => 'business phone',
            'email'          => 'email address',
        ];
    }
}
