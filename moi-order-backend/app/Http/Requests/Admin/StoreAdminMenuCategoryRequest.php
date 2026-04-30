<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdminMenuCategoryRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name'       => ['required', 'string', 'max:100'],
            'sort_order' => ['integer', 'min:0', 'max:9999'],
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge(['sort_order' => (int) $this->input('sort_order', 0)]);
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return ['name.required' => 'Category name is required.'];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return ['name' => 'category name', 'sort_order' => 'sort order'];
    }
}
