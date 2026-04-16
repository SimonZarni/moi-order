<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUpdateTagRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name_my' => ['sometimes', 'required', 'string', 'max:255'],
            'name_en' => ['sometimes', 'required', 'string', 'max:255'],
            'name_th' => ['sometimes', 'nullable', 'string', 'max:255'],
            'slug'    => ['sometimes', 'required', 'string', 'max:100',
                Rule::unique('tags', 'slug')->ignore($this->route('tag')?->id),
            ],
        ];
    }
}
