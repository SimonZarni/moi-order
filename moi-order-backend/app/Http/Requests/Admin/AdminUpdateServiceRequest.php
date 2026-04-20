<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUpdateServiceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $serviceId = $this->route('service')?->id;

        return [
            'name'      => ['sometimes', 'string', 'max:255'],
            'name_en'   => ['sometimes', 'string', 'max:255'],
            'name_mm'   => ['sometimes', 'nullable', 'string', 'max:255'],
            'slug'      => ['sometimes', 'string', 'max:100', Rule::unique('services', 'slug')->ignore($serviceId)],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return ['name_en' => 'English name', 'name_mm' => 'Myanmar name', 'is_active' => 'active status'];
    }
}
