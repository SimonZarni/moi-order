<?php

declare(strict_types=1);

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class RequestPhoneOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'phone_number' => ['required', 'string', 'max:20'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'phone_number.required' => 'Phone number is required.',
            'phone_number.string'   => 'Phone number must be a string.',
            'phone_number.max'      => 'Phone number is too long.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return ['phone_number' => 'phone number'];
    }
}
