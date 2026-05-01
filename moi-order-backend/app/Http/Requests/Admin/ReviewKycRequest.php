<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validation for admin KYC approve/reject action.
 * Principle: Validation — cross-field rule: notes required when action=reject.
 */
class ReviewKycRequest extends FormRequest
{
    public function authorize(): bool
    {
        // admin.auth middleware asserts is_admin.
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'action' => ['required', 'string', 'in:approve,reject'],
            'notes'  => ['nullable', 'required_if:action,reject', 'string', 'max:1000'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'action.required'    => 'Action is required.',
            'action.in'          => 'Action must be either approve or reject.',
            'notes.required_if'  => 'Notes are required when rejecting an application.',
            'notes.max'          => 'Notes may not exceed 1000 characters.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'action' => 'review action',
            'notes'  => 'review notes',
        ];
    }
}
