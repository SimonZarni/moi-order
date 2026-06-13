<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\RestaurantPlatformStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRestaurantPlatformStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // AdminAuthenticate middleware guards this route
    }

    public function rules(): array
    {
        return [
            'platform_status' => ['required', Rule::enum(RestaurantPlatformStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'platform_status.required' => 'A platform status is required.',
            'platform_status.enum'     => 'Platform status must be active or suspended.',
        ];
    }

    public function attributes(): array
    {
        return [
            'platform_status' => 'platform status',
        ];
    }
}
