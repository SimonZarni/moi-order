<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\MenuItemStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminMenuItemRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'menu_category_id' => ['sometimes', 'integer', Rule::exists('menu_categories', 'id')],
            'name'             => ['sometimes', 'string', 'max:255'],
            'description'      => ['sometimes', 'nullable', 'string', 'max:1000'],
            'price_cents'      => ['sometimes', 'integer', 'min:0'],
            'status'           => ['sometimes', Rule::enum(MenuItemStatus::class)],
            'sort_order'       => ['sometimes', 'integer', 'min:0', 'max:9999'],
            'photo'            => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'price_cents.min'         => 'Price must be 0 or greater.',
            'menu_category_id.exists' => 'Selected category does not exist.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return ['price_cents' => 'price', 'menu_category_id' => 'category'];
    }
}
