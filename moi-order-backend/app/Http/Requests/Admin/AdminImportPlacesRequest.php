<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminImportPlacesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // auth:sanctum + abilities:admin enforced by middleware
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ];
    }

    public function attributes(): array
    {
        return [
            'file' => 'import file',
        ];
    }

    public function messages(): array
    {
        return [
            'file.mimes' => 'The import file must be an Excel (.xlsx, .xls) or CSV file.',
            'file.max'   => 'The import file must not exceed 10MB.',
        ];
    }
}
