<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use App\Enums\FoodOrderStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
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
            'status'                   => ['required', Rule::enum(FoodOrderStatus::class)],
            'cancel_reason'            => ['nullable', 'string', 'in:closing_soon,sold_out,out_of_range', 'max:100'],
            'cancel_description'       => ['nullable', 'string', 'max:500'],
            'preparation_time_minutes' => ['nullable', 'integer', 'min:5', 'max:180'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            if (
                $this->input('status') === FoodOrderStatus::PreparingFood->value &&
                $this->input('preparation_time_minutes') === null
            ) {
                $v->errors()->add('preparation_time_minutes', 'Preparation time is required when starting to prepare the order.');
            }
        });
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'status.required'                   => 'Order status is required.',
            'preparation_time_minutes.min'       => 'Preparation time must be at least 5 minutes.',
            'preparation_time_minutes.max'       => 'Preparation time cannot exceed 180 minutes.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'status'                   => 'order status',
            'preparation_time_minutes' => 'preparation time',
        ];
    }
}
