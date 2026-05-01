<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\HomeCardRouteType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHomeCardRouteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // permission checked in middleware
    }

    public function rules(): array
    {
        return [
            'key'      => ['required', 'string', 'max:100', 'regex:/^[a-zA-Z0-9_-]+$/', 'unique:home_card_routes,key'],
            'label_en' => ['required', 'string', 'max:100'],
            'label_mm' => ['required', 'string', 'max:200'],
            'type'     => ['required', 'string', Rule::enum(HomeCardRouteType::class)],
            'url'      => ['required_if:type,external_url', 'nullable', 'string', 'url', 'max:2048'],
        ];
    }

    public function attributes(): array
    {
        return [
            'key'      => 'route key',
            'label_en' => 'English label',
            'label_mm' => 'Myanmar label',
            'type'     => 'route type',
            'url'      => 'URL',
        ];
    }

    public function messages(): array
    {
        return [
            'key.regex'          => 'The route key may only contain letters, numbers, hyphens, and underscores.',
            'url.required_if'    => 'A URL is required when route type is External URL.',
        ];
    }
}
