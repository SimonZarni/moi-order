<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates LINE auth payload only.
 */
class LineAuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public endpoint
    }

    public function rules(): array
    {
        return [
            'id_token' => ['required', 'string'],
            'nonce'    => ['sometimes', 'nullable', 'string', 'max:255'],
            'name'     => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'id_token' => 'LINE identity token',
            'nonce'    => 'LINE ID token nonce',
            'name'     => 'LINE account name',
        ];
    }

    public function messages(): array
    {
        return [
            'id_token.required' => 'A LINE identity token is required.',
        ];
    }
}
