<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminPlaceIndexRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'integer', 'min:1', Rule::exists('categories', 'id')],
            'city'        => ['sometimes', 'string', 'max:100'],
            'search'      => ['sometimes', 'string', 'max:100'],
            'per_page'    => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
