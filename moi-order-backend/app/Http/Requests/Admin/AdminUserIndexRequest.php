<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserIndexRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'search'    => ['sometimes', 'string', 'max:100'],
            'date_from' => ['sometimes', 'date'],
            'date_to'   => ['sometimes', 'date', 'after_or_equal:date_from'],
            'per_page'  => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
