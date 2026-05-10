<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // permission checked in middleware
    }

    public function rules(): array
    {
        return [
            'name'              => ['required', 'string', 'max:100'],
            'name_en'           => ['required', 'string', 'max:100'],
            'name_mm'           => ['nullable', 'string', 'max:200'],
            'slug'              => ['required', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', 'unique:service_categories,slug'],
            'navigation_screen' => ['nullable', 'string', Rule::exists('home_card_routes', 'key')],
            'is_active'         => ['required', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'              => 'Thai name',
            'name_en'           => 'English name',
            'name_mm'           => 'Myanmar name',
            'slug'              => 'slug',
            'navigation_screen' => 'navigation screen',
            'is_active'         => 'active status',
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex' => 'The slug may only contain lowercase letters, numbers, and hyphens.',
        ];
    }
}
