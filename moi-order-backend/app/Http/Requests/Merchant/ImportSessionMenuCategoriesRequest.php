<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class ImportSessionMenuCategoriesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_merchant ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'category_ids'   => ['required', 'array', 'min:1', 'max:50'],
            'category_ids.*' => ['required', 'integer', 'min:1'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'category_ids.required' => 'At least one category ID is required.',
            'category_ids.min'      => 'Select at least one category to import.',
            'category_ids.max'      => 'Cannot import more than 50 categories at once.',
            'category_ids.*.integer' => 'Each category ID must be a valid integer.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'category_ids'   => 'category IDs',
            'category_ids.*' => 'category ID',
        ];
    }
}
