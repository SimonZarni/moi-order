<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminUpdateServiceTypeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'      => ['sometimes', 'string', 'max:255'],
            'name_en'   => ['sometimes', 'string', 'max:255'],
            'price'     => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name_en'   => 'English name',
            'price'     => 'price (satangs)',
            'is_active' => 'active status',
        ];
    }
}
