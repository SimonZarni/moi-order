<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\SubmissionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Principle: SRP — validates admin status-transition input only.
 * Only the two admin-writable statuses are accepted here; validation prevents
 * invalid enum values from ever reaching the service layer.
 */
class AdminUpdateSubmissionStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorisation handled by admin.auth middleware
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                // Admin may only drive these two transitions.
                // Business-rule violations (wrong current state) are 409s in the service.
                Rule::in([
                    SubmissionStatus::Processing->value,
                    SubmissionStatus::Completed->value,
                ]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Status must be one of: processing, completed.',
        ];
    }

    public function attributes(): array
    {
        return [
            'status' => 'status',
        ];
    }
}
