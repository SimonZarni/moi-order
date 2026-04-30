<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\RestaurantStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminRestaurantRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name'                  => ['sometimes', 'string', 'max:255'],
            'description'           => ['sometimes', 'nullable', 'string', 'max:2000'],
            'address'               => ['sometimes', 'nullable', 'string', 'max:500'],
            'latitude'              => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude'             => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'phone'                 => ['sometimes', 'nullable', 'string', 'max:30'],
            'status'                => ['sometimes', Rule::enum(RestaurantStatus::class)],
            'delivery_radius_km'    => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:100'],
            'is_delivery_available' => ['sometimes', 'boolean'],
            'is_pickup_available'   => ['sometimes', 'boolean'],
            'min_order_cents'       => ['sometimes', 'integer', 'min:0'],
            'opening_hours'                  => ['sometimes', 'array'],
            'opening_hours.*.day_of_week'    => ['required', 'integer', 'between:0,6'],
            'opening_hours.*.opens_at'       => ['nullable', 'date_format:H:i'],
            'opening_hours.*.closes_at'      => ['nullable', 'date_format:H:i'],
            'opening_hours.*.is_closed'      => ['boolean'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'opening_hours.*.day_of_week.between' => 'Day of week must be 0 (Sunday) through 6 (Saturday).',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'name'               => 'restaurant name',
            'delivery_radius_km' => 'delivery radius',
            'min_order_cents'    => 'minimum order amount',
        ];
    }
}
