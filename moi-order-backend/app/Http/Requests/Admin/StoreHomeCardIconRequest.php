<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreHomeCardIconRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // permission checked in middleware
    }

    public function rules(): array
    {
        return [
            'key'   => ['required', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', 'unique:home_card_icons,key'],
            'label' => ['required', 'string', 'max:100'],
            'image' => ['required', 'file', 'mimes:png,jpg,jpeg', 'max:2048'],
        ];
    }

    public function attributes(): array
    {
        return [
            'key'   => 'icon key',
            'label' => 'icon label',
            'image' => 'icon image',
        ];
    }

    public function messages(): array
    {
        return [
            'key.regex'   => 'The icon key may only contain lowercase letters, numbers, and hyphens.',
            'image.mimes' => 'The icon image must be a PNG or JPEG file.',
            'image.max'   => 'The icon image must not exceed 2 MB.',
        ];
    }
}
