<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use App\Enums\FoodPaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFoodOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function prepareForValidation(): void
    {
        if ($this->has('customer_notes')) {
            $this->merge(['customer_notes' => strip_tags(trim((string) $this->input('customer_notes')))]);
        }

        $items = $this->input('items', []);
        if (is_array($items)) {
            $this->merge([
                'items' => array_map(static function (mixed $item): mixed {
                    if (is_array($item) && isset($item['notes'])) {
                        $item['notes'] = strip_tags(trim((string) $item['notes']));
                    }
                    return $item;
                }, $items),
            ]);
        }
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'restaurant_id'    => ['required', 'integer', 'exists:restaurants,id'],
            'payment_method'   => ['required', Rule::enum(FoodPaymentMethod::class)],
            'idempotency_key'  => ['required', 'string', 'uuid'],
            'delivery_address_id' => ['nullable', 'integer', 'exists:user_addresses,id'],
            'delivery_address'    => ['nullable', 'string', 'max:500'],
            'delivery_lat'        => ['nullable', 'numeric', 'between:-90,90'],
            'delivery_lng'        => ['nullable', 'numeric', 'between:-180,180'],
            'customer_notes'   => ['nullable', 'string', 'max:500'],
            'items'            => ['required', 'array', 'min:1', 'max:50'],
            'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.quantity'     => ['required', 'integer', 'min:1', 'max:99'],
            'items.*.notes'        => ['nullable', 'string', 'max:200'],
            // selected_options validated structurally here; ownership validated in FoodOrderService.
            'items.*.selected_options'                           => ['sometimes', 'nullable', 'array'],
            'items.*.selected_options.*.option_group_id'        => ['required', 'integer', 'exists:menu_item_option_groups,id'],
            'items.*.selected_options.*.option_id'              => ['required', 'integer', 'exists:menu_item_options,id'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'restaurant_id.required'      => 'Restaurant is required.',
            'restaurant_id.exists'        => 'Restaurant not found.',
            'payment_method.required'     => 'Payment method is required.',
            'idempotency_key.required'    => 'Idempotency key is required.',
            'idempotency_key.uuid'        => 'Idempotency key must be a valid UUID.',
            'items.required'              => 'At least one item is required.',
            'items.min'                   => 'At least one item is required.',
            'items.*.menu_item_id.exists' => 'One or more items were not found.',
            'items.*.quantity.min'        => 'Quantity must be at least 1.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'restaurant_id'   => 'restaurant',
            'payment_method'  => 'payment method',
            'idempotency_key' => 'idempotency key',
        ];
    }
}
