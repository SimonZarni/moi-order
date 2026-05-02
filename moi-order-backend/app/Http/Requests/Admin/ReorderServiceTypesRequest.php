<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReorderServiceTypesRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'order'   => ['required', 'array', 'min:1'],
            'order.*' => ['required', 'integer', Rule::exists('service_types', 'id')->whereNull('deleted_at')],
        ];
    }

    public function messages(): array
    {
        return [
            'order.required' => 'An ordered list of service type IDs is required.',
            'order.*.exists' => 'One or more service type IDs are invalid.',
        ];
    }
}
