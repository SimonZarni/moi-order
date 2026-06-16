<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class EditFoodOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isMerchant() === true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'existing_items'            => ['present', 'array'],
            'existing_items.*.id'       => ['required', 'integer', 'min:1'],
            'existing_items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
            'new_items'                 => ['present', 'array'],
            'new_items.*.menu_item_id'  => ['required', 'integer', 'min:1'],
            'new_items.*.quantity'      => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            $existing = $this->input('existing_items', []);
            $new      = $this->input('new_items', []);

            if (empty($existing) && empty($new)) {
                $v->errors()->add('existing_items', 'At least one item must remain in the order.');
            }
        });
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'existing_items.present'             => 'The existing items list is required.',
            'new_items.present'                  => 'The new items list is required.',
            'existing_items.*.id.required'       => 'Each existing item must include an id.',
            'existing_items.*.quantity.min'      => 'Item quantity must be at least 1.',
            'existing_items.*.quantity.max'      => 'Item quantity may not exceed 100.',
            'new_items.*.menu_item_id.required'  => 'Each new item must specify a menu_item_id.',
            'new_items.*.quantity.min'           => 'Item quantity must be at least 1.',
            'new_items.*.quantity.max'           => 'Item quantity may not exceed 100.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'existing_items' => 'existing order items',
            'new_items'      => 'new items to add',
        ];
    }
}
