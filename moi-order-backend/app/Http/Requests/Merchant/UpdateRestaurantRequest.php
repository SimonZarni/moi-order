<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use App\Enums\RestaurantStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRestaurantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isMerchant() === true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            // name and address locked — only updated via KYC resubmission + admin approval.
            'description'           => ['sometimes', 'nullable', 'string', 'max:2000'],
            'phone'                 => ['sometimes', 'nullable', 'string', 'max:30'],
            'status'                => ['sometimes', Rule::enum(RestaurantStatus::class)],
            'delivery_radius_km'    => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:100'],
            'is_delivery_available' => ['sometimes', 'boolean'],
            'is_pickup_available'   => ['sometimes', 'boolean'],
            'min_order_cents'       => ['sometimes', 'integer', 'min:0'],
            'cover_photo'           => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'logo'                  => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'opening_hours'               => ['sometimes', 'array'],
            'opening_hours.*.day_of_week' => ['required', 'integer', 'between:0,6'],
            'opening_hours.*.opens_at'    => ['nullable', 'date_format:H:i'],
            'opening_hours.*.closes_at'   => ['nullable', 'date_format:H:i'],
            'opening_hours.*.is_closed'   => ['boolean'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'cover_photo.max' => 'Cover photo must be under 5 MB.',
            'logo.max'        => 'Logo must be under 2 MB.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'delivery_radius_km' => 'delivery radius',
            'min_order_cents'    => 'minimum order amount',
        ];
    }
}
