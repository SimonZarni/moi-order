<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates Google auth payload only.
 */
class GoogleAuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public endpoint
    }

    public function rules(): array
    {
        return [
            'id_token' => ['required', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'id_token' => 'Google ID token',
        ];
    }

    public function messages(): array
    {
        return [
            'id_token.required' => 'A Google ID token is required.',
        ];
    }
}
