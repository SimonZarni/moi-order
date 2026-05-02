<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Admin\V1;

use App\Enums\CustomNotificationTargetType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Principle: SRP — validates and authorises the send-custom-notification operation only.
 *
 * user_email is conditionally required when target_type is 'single'.
 * The exists rule guards against sending to a deleted or non-existent user.
 */
class SendCustomNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'title'      => ['required', 'string', 'max:100'],
            'body'       => ['required', 'string', 'max:500'],
            'target_type'=> ['required', 'string', Rule::enum(CustomNotificationTargetType::class)],
            'user_email' => [
                Rule::requiredIf($this->input('target_type') === CustomNotificationTargetType::Single->value),
                'nullable',
                'string',
                'email:rfc',
                'max:255',
                Rule::exists('users', 'email')->whereNull('deleted_at'),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.max'           => 'Title may not exceed 100 characters.',
            'body.max'            => 'Message may not exceed 500 characters.',
            'user_email.required' => 'User email is required when targeting a single user.',
            'user_email.exists'   => 'No active user found with that email address.',
        ];
    }

    public function attributes(): array
    {
        return [
            'title'       => 'notification title',
            'body'        => 'notification message',
            'target_type' => 'target audience',
            'user_email'  => 'user email',
        ];
    }
}
