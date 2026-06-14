<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use App\Enums\RestaurantStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRestaurantStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isMerchant() === true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::enum(RestaurantStatus::class)],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'status.required' => 'A status is required.',
            'status.Illuminate\Validation\Rules\Enum' => 'Status must be one of: open, closed, paused.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'status' => 'restaurant status',
        ];
    }
}
