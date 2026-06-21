<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class GenerateInvoicesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date_format:Y-m-d', 'before_or_equal:today'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'date.required'          => 'A date is required.',
            'date.date_format'       => 'Date must be in Y-m-d format.',
            'date.before_or_equal'   => 'Date cannot be in the future.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return ['date' => 'invoice date'];
    }
}
