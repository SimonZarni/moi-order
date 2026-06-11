<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates LINE web OAuth code exchange payload only.
 */
class LineWebAuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public endpoint
    }

    public function rules(): array
    {
        return [
            'code'         => ['required', 'string'],
            'redirect_uri' => ['required', 'string', 'url', 'max:500'],
            'nonce'        => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'code'         => 'LINE authorization code',
            'redirect_uri' => 'redirect URI',
            'nonce'        => 'LINE ID token nonce',
        ];
    }
}
