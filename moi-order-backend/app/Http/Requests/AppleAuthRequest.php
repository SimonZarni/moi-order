<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates Apple auth payload only.
 */
class AppleAuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public endpoint
    }

    public function rules(): array
    {
        return [
            'id_token' => ['required', 'string'],
            'email'    => ['sometimes', 'nullable', 'email:rfc,dns', 'max:255'],
            'name'     => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'id_token' => 'Apple identity token',
            'email'    => 'Apple account email',
            'name'     => 'Apple account name',
        ];
    }

    public function messages(): array
    {
        return [
            'id_token.required' => 'An Apple identity token is required.',
        ];
    }
}
