<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates and authorizes this one operation only.
 * Security: authorize() ensures only privileged accounts can set a simulated date.
 */
class UpdateSimulatedDateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isPrivileged();
    }

    public function rules(): array
    {
        return [
            'date' => ['nullable', 'date_format:Y-m-d'],
        ];
    }

    public function messages(): array
    {
        return [
            'date.date_format' => 'The date must be in YYYY-MM-DD format.',
        ];
    }

    public function attributes(): array
    {
        return [
            'date' => 'simulated date',
        ];
    }
}
