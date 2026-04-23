<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminSuspendUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            // null = indefinite suspension; a future datetime = timed suspension.
            'suspended_until' => ['nullable', 'date', 'after:now'],
        ];
    }

    public function messages(): array
    {
        return [
            'suspended_until.after' => 'The suspension end date must be in the future.',
        ];
    }
}
