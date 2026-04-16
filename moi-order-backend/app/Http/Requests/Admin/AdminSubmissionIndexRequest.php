<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\SubmissionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Principle: SRP — validates + sanitises admin submission list filters only.
 * Principle: Security — per_page capped at 100; no raw SQL from user input.
 */
class AdminSubmissionIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorisation handled by admin.auth middleware
    }

    public function rules(): array
    {
        return [
            'status'     => ['sometimes', 'string', Rule::enum(SubmissionStatus::class)],
            'service_id' => ['sometimes', 'integer', 'min:1', Rule::exists('services', 'id')],
            'user_id'    => ['sometimes', 'integer', 'min:1', Rule::exists('users', 'id')],
            'date_from'  => ['sometimes', 'date'],
            'date_to'    => ['sometimes', 'date', 'after_or_equal:date_from'],
            'search'     => ['sometimes', 'string', 'max:100'],
            'per_page'   => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.Illuminate\Validation\Rules\Enum' => 'Invalid submission status.',
            'date_to.after_or_equal' => 'date_to must be on or after date_from.',
        ];
    }

    public function attributes(): array
    {
        return [
            'service_id' => 'service',
            'user_id'    => 'user',
            'date_from'  => 'start date',
            'date_to'    => 'end date',
            'per_page'   => 'page size',
        ];
    }
}
