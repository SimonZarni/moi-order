<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates one operation: store a browser push subscription.
 */
class StorePushSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'endpoint'   => ['required', 'string', 'max:2048'],
            'p256dh_key' => ['required', 'string', 'max:255'],
            'auth_key'   => ['required', 'string', 'max:255'],
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'endpoint'   => 'push endpoint',
            'p256dh_key' => 'p256dh key',
            'auth_key'   => 'auth key',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'endpoint.required'   => 'Push endpoint is required.',
            'p256dh_key.required' => 'p256dh key is required.',
            'auth_key.required'   => 'Auth key is required.',
        ];
    }
}
