<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminStoreDocumentTypeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'slug'      => ['required', 'string', 'max:50', 'regex:/^[a-z][a-z0-9_]*$/', Rule::unique('document_types', 'slug')->whereNull('deleted_at')],
            'name_en'   => ['required', 'string', 'max:255'],
            'name_mm'   => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex'  => 'Slug must be lowercase snake_case (e.g. my_document).',
            'slug.unique' => 'This slug is already taken.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name_en'   => 'English name',
            'name_mm'   => 'Myanmar name',
            'is_active' => 'active status',
        ];
    }
}
