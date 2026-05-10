<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\ServiceCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // permission checked in middleware
    }

    public function rules(): array
    {
        $category = ServiceCategory::where('slug', $this->route('slug'))->firstOrFail();

        return [
            'name'              => ['required', 'string', 'max:100'],
            'name_en'           => ['required', 'string', 'max:100'],
            'name_mm'           => ['nullable', 'string', 'max:200'],
            'slug'              => ['required', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('service_categories', 'slug')->ignore($category->id)],
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
