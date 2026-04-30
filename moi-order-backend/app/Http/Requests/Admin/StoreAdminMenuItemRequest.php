<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\MenuItemStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdminMenuItemRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'menu_category_id' => ['required', 'integer', Rule::exists('menu_categories', 'id')],
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['nullable', 'string', 'max:1000'],
            'price_cents'      => ['required', 'integer', 'min:0'],
            'status'           => ['sometimes', Rule::enum(MenuItemStatus::class)],
            'sort_order'       => ['integer', 'min:0', 'max:9999'],
            'photo'            => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'price_cents' => (int) $this->input('price_cents', 0),
            'sort_order'  => (int) $this->input('sort_order', 0),
        ]);
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'menu_category_id.required' => 'Please select a category.',
            'menu_category_id.exists'   => 'Selected category does not exist.',
            'name.required'             => 'Item name is required.',
            'price_cents.required'      => 'Price is required.',
            'price_cents.min'           => 'Price must be 0 or greater.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'menu_category_id' => 'category',
            'name'             => 'item name',
            'price_cents'      => 'price',
        ];
    }
}
