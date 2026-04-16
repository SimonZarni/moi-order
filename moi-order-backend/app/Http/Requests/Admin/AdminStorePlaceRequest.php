<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminStorePlaceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'category_id'       => ['required', 'integer', Rule::exists('categories', 'id')],
            'name_my'           => ['required', 'string', 'max:255'],
            'name_en'           => ['required', 'string', 'max:255'],
            'name_th'           => ['sometimes', 'nullable', 'string', 'max:255'],
            'short_description' => ['sometimes', 'nullable', 'string', 'max:500'],
            'long_description'  => ['sometimes', 'nullable', 'string', 'max:5000'],
            'address'           => ['sometimes', 'nullable', 'string', 'max:500'],
            'city'              => ['sometimes', 'nullable', 'string', 'max:100'],
            'latitude'          => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude'         => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'opening_hours'     => ['sometimes', 'nullable', 'string', 'max:500'],
            'contact_phone'     => ['sometimes', 'nullable', 'string', 'max:50'],
            'website'           => ['sometimes', 'nullable', 'string', 'url', 'max:500'],
            'google_map_url'    => ['sometimes', 'nullable', 'string', 'url', 'max:500'],
            'tag_ids'           => ['sometimes', 'array'],
            'tag_ids.*'         => ['integer', Rule::exists('tags', 'id')],
        ];
    }
}
