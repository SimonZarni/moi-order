<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReorderServicesRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'order'   => ['required', 'array', 'min:1'],
            'order.*' => ['required', 'integer', Rule::exists('services', 'id')->whereNull('deleted_at')],
        ];
    }

    public function messages(): array
    {
        return [
            'order.required'      => 'An ordered list of service IDs is required.',
            'order.*.exists'      => 'One or more service IDs are invalid.',
        ];
    }
}
