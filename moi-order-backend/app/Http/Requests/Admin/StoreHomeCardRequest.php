<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHomeCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // permission checked in middleware
    }

    public function rules(): array
    {
        return [
            'slug'              => ['required', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', 'unique:home_cards,slug'],
            'title_en'          => ['required', 'string', 'max:100'],
            'title_mm'          => ['required', 'string', 'max:200'],
            'subtitle_en'       => ['nullable', 'string', 'max:200'],
            'subtitle_mm'       => ['nullable', 'string', 'max:400'],
            'tag_en'            => ['required', 'string', 'max:50'],
            'tag_mm'            => ['required', 'string', 'max:100'],
            'accent_color'      => ['required', 'string', 'max:20', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'icon_key'          => ['required', 'string', Rule::exists('home_card_icons', 'key')],
            'navigation_screen' => ['required', 'string', Rule::exists('home_card_routes', 'key')],
            'navigation_params' => ['nullable', 'array'],
            'is_active'         => ['required', 'boolean'],
            'is_coming_soon'    => ['required', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'slug'              => 'slug',
            'title_en'          => 'English title',
            'title_mm'          => 'Myanmar title',
            'subtitle_en'       => 'English subtitle',
            'subtitle_mm'       => 'Myanmar subtitle',
            'tag_en'            => 'English tag',
            'tag_mm'            => 'Myanmar tag',
            'accent_color'      => 'accent colour',
            'icon_key'          => 'icon',
            'navigation_screen' => 'navigation target',
            'navigation_params' => 'navigation parameters',
            'is_active'         => 'active status',
            'is_coming_soon'    => 'coming soon flag',
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex'         => 'The slug may only contain lowercase letters, numbers, and hyphens.',
            'accent_color.regex' => 'The accent colour must be a valid hex colour (e.g. #52796f).',
        ];
    }
}
