<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use App\Enums\FoodOrderStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFoodOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isMerchant() === true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'status'             => ['required', Rule::enum(FoodOrderStatus::class)],
            'cancel_reason'      => ['nullable', 'string', 'in:closing_soon,sold_out,out_of_range', 'max:100'],
            'cancel_description' => ['nullable', 'string', 'max:500'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'status.required' => 'Order status is required.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return ['status' => 'order status'];
    }
}
