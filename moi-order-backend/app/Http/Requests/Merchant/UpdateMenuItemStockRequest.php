<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuItemStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isMerchant() === true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'stock_quantity' => ['required', 'nullable', 'integer', 'min:0', 'max:9999999'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'stock_quantity.min' => 'Stock quantity cannot be negative.',
            'stock_quantity.max' => 'Stock quantity cannot exceed 9,999,999.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return ['stock_quantity' => 'stock quantity'];
    }
}
