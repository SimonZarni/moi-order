<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\SafetyCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSafetyLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'         => ['sometimes', 'required', 'string', 'max:255'],
            'category'     => ['sometimes', 'required', 'string', Rule::enum(SafetyCategory::class)],
            'phone'        => ['nullable', 'string', 'max:100'],
            'location'     => ['nullable', 'string', 'max:500'],
            'fb_page_link' => ['nullable', 'string', 'url', 'max:500'],
            'gmap_link'    => ['nullable', 'string', 'url', 'max:500'],
            'description'  => ['nullable', 'string', 'max:5000'],
            'latitude'     => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'    => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }

    public function attributes(): array
    {
        return [
            'fb_page_link' => 'Facebook page link',
            'gmap_link'    => 'Google Maps link',
        ];
    }
}
