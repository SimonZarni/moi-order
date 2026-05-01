<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\HomeCardIconKey;
use App\Enums\HomeCardNavigationScreen;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHomeCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cardId = $this->route('homeCard')?->id;

        return [
            'slug'              => ['sometimes', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('home_cards', 'slug')->ignore($cardId)],
            'title_en'          => ['sometimes', 'string', 'max:100'],
            'title_mm'          => ['sometimes', 'string', 'max:200'],
            'subtitle_en'       => ['nullable', 'string', 'max:200'],
            'subtitle_mm'       => ['nullable', 'string', 'max:400'],
            'tag_en'            => ['sometimes', 'string', 'max:50'],
            'tag_mm'            => ['sometimes', 'string', 'max:100'],
            'accent_color'      => ['sometimes', 'string', 'max:20', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'icon_key'          => ['sometimes', 'string', Rule::enum(HomeCardIconKey::class)],
            'navigation_screen' => ['sometimes', 'string', Rule::enum(HomeCardNavigationScreen::class)],
            'navigation_params' => ['nullable', 'array'],
            'is_active'         => ['sometimes', 'boolean'],
            'is_coming_soon'    => ['sometimes', 'boolean'],
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
