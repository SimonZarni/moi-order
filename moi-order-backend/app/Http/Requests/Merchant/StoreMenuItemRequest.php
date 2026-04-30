<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use App\Enums\MenuItemStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isMerchant() === true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price_cents' => ['required', 'integer', 'min:0'],
            'status'      => ['sometimes', Rule::enum(MenuItemStatus::class)],
            'sort_order'  => ['integer', 'min:0', 'max:9999'],
            'photo'       => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:3072'],
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
            'name.required'        => 'Item name is required.',
            'price_cents.required' => 'Price is required.',
            'price_cents.min'      => 'Price must be 0 or greater.',
            'photo.max'            => 'Item photo must be under 3 MB.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'name'        => 'item name',
            'price_cents' => 'price',
        ];
    }
}
