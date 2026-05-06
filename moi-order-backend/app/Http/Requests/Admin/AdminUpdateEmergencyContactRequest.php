<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\EmergencyContactType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUpdateEmergencyContactRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'type'            => ['required', 'string', Rule::enum(EmergencyContactType::class)],
            'title_en'        => ['required', 'string', 'max:255'],
            'title_mm'        => ['required', 'string', 'max:255'],
            'title_th'        => ['sometimes', 'nullable', 'string', 'max:255'],
            'description_en'  => ['sometimes', 'nullable', 'string', 'max:5000'],
            'description_mm'  => ['sometimes', 'nullable', 'string', 'max:5000'],
            'description_th'  => ['sometimes', 'nullable', 'string', 'max:5000'],
            'phone'           => ['sometimes', 'nullable', 'string', 'max:50'],
            'map_url'         => ['sometimes', 'nullable', 'string', 'url', 'max:1000'],
            'latitude'        => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude'       => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'location'        => ['sometimes', 'nullable', 'string', 'max:500'],
            'facebook_url'    => ['sometimes', 'nullable', 'string', 'url', 'max:1000'],
            'website_url'     => ['sometimes', 'nullable', 'string', 'url', 'max:1000'],
            'is_active'       => ['sometimes', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'title_en'    => 'English title',
            'title_mm'    => 'Myanmar title',
            'map_url'     => 'map URL',
            'facebook_url' => 'Facebook URL',
            'website_url'  => 'website URL',
        ];
    }
}
