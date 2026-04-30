<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use App\Enums\MenuItemStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isMerchant() === true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name'             => ['sometimes', 'string', 'max:255'],
            'description'      => ['sometimes', 'nullable', 'string', 'max:1000'],
            'price_cents'      => ['sometimes', 'integer', 'min:0'],
            'menu_category_id' => ['sometimes', 'integer', 'exists:menu_categories,id'],
            'status'           => ['sometimes', Rule::enum(MenuItemStatus::class)],
            'sort_order'       => ['sometimes', 'integer', 'min:0', 'max:9999'],
            'photo'            => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:3072'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'photo.max' => 'Item photo must be under 3 MB.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'price_cents'      => 'price',
            'menu_category_id' => 'category',
        ];
    }
}
