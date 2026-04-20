<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminStoreServiceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'      => ['required', 'string', 'max:255'],
            'name_en'   => ['required', 'string', 'max:255'],
            'name_mm'   => ['nullable', 'string', 'max:255'],
            'slug'      => ['required', 'string', 'max:100', Rule::unique('services', 'slug')],
            'is_active' => ['required', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return ['name_en' => 'English name', 'name_mm' => 'Myanmar name', 'is_active' => 'active status'];
    }
}
