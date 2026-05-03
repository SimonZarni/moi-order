<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates one operation: remove a browser push subscription.
 */
class DeletePushSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'endpoint' => ['required', 'string', 'max:2048'],
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'endpoint' => 'push endpoint',
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'endpoint.required' => 'Push endpoint is required.',
        ];
    }
}
