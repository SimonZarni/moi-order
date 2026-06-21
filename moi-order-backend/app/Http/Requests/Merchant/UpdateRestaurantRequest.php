<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use App\Enums\RestaurantStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
            'latitude'              => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude'             => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'status'                => ['sometimes', Rule::enum(RestaurantStatus::class)],
            'delivery_radius_km'    => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:100'],
            'is_delivery_available' => ['sometimes', 'boolean'],
            'is_pickup_available'   => ['sometimes', 'boolean'],
            'min_order_cents'       => ['sometimes', 'integer', 'min:0'],
            'cover_photo'           => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:51200'],
            'logo'                  => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:51200'],
            'opening_hours'                         => ['sometimes', 'array'],
            'opening_hours.*.day_of_week'          => ['required', 'integer', 'between:0,6'],
            'opening_hours.*.is_closed'            => ['required', 'boolean'],
            'opening_hours.*.sessions'             => ['required', 'array', 'max:4'],
            'opening_hours.*.sessions.*.opens_at'  => ['required', 'date_format:H:i'],
            'opening_hours.*.sessions.*.closes_at' => ['required', 'date_format:H:i'],
        ];
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
            'latitude'           => 'latitude',
            'longitude'          => 'longitude',
        ];
    }
}
