<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\RestaurantStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdminRestaurantRequest extends FormRequest
{
    // Admin middleware already enforces auth + admin ability.
    public function authorize(): bool { return true; }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'user_id'               => ['required', 'integer', Rule::exists('users', 'id')],
            'name'                  => ['required', 'string', 'max:255'],
            'description'           => ['nullable', 'string', 'max:2000'],
            'address'               => ['nullable', 'string', 'max:500'],
            'latitude'              => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'             => ['nullable', 'numeric', 'between:-180,180'],
            'phone'                 => ['nullable', 'string', 'max:30'],
            'delivery_radius_km'    => ['nullable', 'numeric', 'min:0', 'max:100'],
            'is_delivery_available' => ['boolean'],
            'is_pickup_available'   => ['boolean'],
            'min_order_cents'       => ['integer', 'min:0'],
            'status'                => ['sometimes', Rule::enum(RestaurantStatus::class)],
            'cover_photo'           => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'logo'                  => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'opening_hours'                  => ['nullable', 'array'],
            'opening_hours.*.day_of_week'    => ['required', 'integer', 'between:0,6'],
            'opening_hours.*.opens_at'       => ['nullable', 'date_format:H:i'],
            'opening_hours.*.closes_at'      => ['nullable', 'date_format:H:i'],
            'opening_hours.*.is_closed'      => ['boolean'],
        ];
    }

    public function prepareForValidation(): void
    {
        $merge = [
            'is_delivery_available' => $this->boolean('is_delivery_available', true),
            'is_pickup_available'   => $this->boolean('is_pickup_available', true),
            'min_order_cents'       => (int) $this->input('min_order_cents', 0),
        ];

        // FormData sends opening_hours as a JSON string — decode it back to array.
        if (is_string($this->input('opening_hours'))) {
            $merge['opening_hours'] = json_decode($this->input('opening_hours'), true) ?? [];
        }

        $this->merge($merge);
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'user_id.required' => 'Please select a user to assign this restaurant to.',
            'user_id.exists'   => 'Selected user does not exist.',
            'name.required'    => 'Restaurant name is required.',
            'opening_hours.*.day_of_week.between' => 'Day of week must be 0 (Sunday) through 6 (Saturday).',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'user_id'            => 'merchant user',
            'name'               => 'restaurant name',
            'delivery_radius_km' => 'delivery radius',
            'min_order_cents'    => 'minimum order amount',
        ];
    }
}
