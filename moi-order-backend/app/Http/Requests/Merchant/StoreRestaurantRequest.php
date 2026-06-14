<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use App\Enums\RestaurantStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreRestaurantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isMerchant() === true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
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
            'cover_photo'           => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:51200'],
            'logo'                  => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:51200'],
            'opening_hours'                             => ['nullable', 'array'],
            'opening_hours.*.day_of_week'              => ['required', 'integer', 'between:0,6'],
            'opening_hours.*.is_closed'                => ['required', 'boolean'],
            'opening_hours.*.sessions'                 => ['required', 'array', 'max:4'],
            'opening_hours.*.sessions.*.opens_at'      => ['required', 'date_format:H:i'],
            'opening_hours.*.sessions.*.closes_at'     => ['required', 'date_format:H:i'],
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'is_delivery_available' => $this->boolean('is_delivery_available', true),
            'is_pickup_available'   => $this->boolean('is_pickup_available', true),
            'min_order_cents'       => (int) $this->input('min_order_cents', 0),
        ]);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            foreach ($this->input('opening_hours', []) as $i => $day) {
                if ($day['is_closed'] ?? false) {
                    continue;
                }
                $sessions = $day['sessions'] ?? [];
                if (empty($sessions)) {
                    $v->errors()->add("opening_hours.{$i}.sessions", 'At least one session is required for an open day.');
                    continue;
                }
                foreach ($sessions as $j => $session) {
                    $opens  = $session['opens_at'] ?? null;
                    $closes = $session['closes_at'] ?? null;
                    if ($opens && $closes && $closes <= $opens) {
                        $v->errors()->add("opening_hours.{$i}.sessions.{$j}.closes_at", 'Closing time must be after opening time.');
                    }
                }
                for ($j = 0; $j < count($sessions) - 1; $j++) {
                    $currentClose = $sessions[$j]['closes_at'] ?? null;
                    $nextOpen     = $sessions[$j + 1]['opens_at'] ?? null;
                    if ($currentClose && $nextOpen && $currentClose > $nextOpen) {
                        $v->errors()->add("opening_hours.{$i}.sessions", 'Sessions must not overlap.');
                    }
                }
            }
        });
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required'            => 'Restaurant name is required.',
            'cover_photo.max'          => 'Cover photo must be under 5 MB.',
            'logo.max'                 => 'Logo must be under 2 MB.',
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
