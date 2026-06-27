<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use App\Enums\MenuCategoryType;
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
            'name'                   => ['required', 'string', 'max:255'],
            'description'            => ['nullable', 'string', 'max:1000'],
            'price_cents'            => ['required', 'integer', 'min:0'],
            'original_price_cents'   => ['nullable', 'integer', 'min:0'],
            'status'                 => ['sometimes', Rule::enum(MenuItemStatus::class)],
            'sort_order'             => ['integer', 'min:0', 'max:9999'],
            'photo'                  => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp,heic,heif', 'max:51200'],
            'option_groups'                           => ['sometimes', 'array'],
            'option_groups.*.name'                    => ['required', 'string', 'max:100'],
            'option_groups.*.is_required'             => ['boolean'],
            'option_groups.*.min_selections'          => ['integer', 'min:0', 'max:10'],
            'option_groups.*.max_selections'          => ['integer', 'min:1', 'max:10'],
            'option_groups.*.options'                 => ['required', 'array', 'min:1'],
            'option_groups.*.options.*.name'                    => ['required', 'string', 'max:100'],
            'option_groups.*.options.*.additional_price_cents'  => ['integer', 'min:0'],
            'also_add_to'   => ['nullable', 'array', 'max:3'],
            'also_add_to.*' => ['string', Rule::enum(MenuCategoryType::class)],
        ];
    }

    public function withValidator(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        $validator->after(function ($v) {
            foreach ((array) $this->input('option_groups', []) as $i => $group) {
                $min = (int) ($group['min_selections'] ?? 0);
                $max = (int) ($group['max_selections'] ?? 1);
                if ($min > $max) {
                    $v->errors()->add(
                        "option_groups.{$i}.min_selections",
                        'Minimum selections cannot exceed maximum selections.'
                    );
                }
            }
        });
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'price_cents'          => (int) $this->input('price_cents', 0),
            'original_price_cents' => $this->input('original_price_cents') !== null
                ? (int) $this->input('original_price_cents') : null,
            'sort_order'           => (int) $this->input('sort_order', 0),
        ]);
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required'        => 'Item name is required.',
            'price_cents.required' => 'Price is required.',
            'price_cents.min'      => 'Price must be 0 or greater.',
            'photo.max'            => 'Item photo must be under 5 MB.',
            'photo.mimes'          => 'Photo must be a JPEG, PNG, WebP, or HEIC image.',
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
