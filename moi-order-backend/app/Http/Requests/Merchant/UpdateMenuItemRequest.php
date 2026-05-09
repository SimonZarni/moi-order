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
            'name'                                        => ['sometimes', 'string', 'max:255'],
            'description'                                 => ['sometimes', 'nullable', 'string', 'max:1000'],
            'price_cents'                                 => ['sometimes', 'integer', 'min:0'],
            'original_price_cents'                        => ['sometimes', 'nullable', 'integer', 'min:0'],
            'menu_category_id'                            => ['sometimes', 'integer', 'exists:menu_categories,id'],
            'status'                                      => ['sometimes', Rule::enum(MenuItemStatus::class)],
            'sort_order'                                  => ['sometimes', 'integer', 'min:0', 'max:9999'],
            'photo'                                       => ['sometimes', 'nullable', 'file', 'mimes:jpeg,jpg,png,webp,heic,heif', 'max:5120'],
            'option_groups'                               => ['sometimes', 'array'],
            'option_groups.*.name'                        => ['required', 'string', 'max:100'],
            'option_groups.*.is_required'                 => ['boolean'],
            'option_groups.*.max_selections'              => ['integer', 'min:1', 'max:10'],
            'option_groups.*.options'                     => ['required', 'array', 'min:1'],
            'option_groups.*.options.*.name'              => ['required', 'string', 'max:100'],
            'option_groups.*.options.*.additional_price_cents' => ['integer', 'min:0'],
        ];
    }

    public function prepareForValidation(): void
    {
        $merged = [];
        if ($this->has('price_cents')) {
            $merged['price_cents'] = (int) $this->input('price_cents', 0);
        }
        if ($this->has('original_price_cents')) {
            $merged['original_price_cents'] = $this->input('original_price_cents') !== null
                ? (int) $this->input('original_price_cents') : null;
        }
        if (! empty($merged)) {
            $this->merge($merged);
        }
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'photo.max'  => 'Item photo must be under 5 MB.',
            'photo.mimes' => 'Photo must be a JPEG, PNG, WebP, or HEIC image.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'price_cents'          => 'price',
            'original_price_cents' => 'original price',
            'menu_category_id'     => 'category',
        ];
    }
}
