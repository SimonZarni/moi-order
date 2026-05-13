<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class GooglePlacesSearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q'   => ['required', 'string', 'min:2', 'max:200'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }

    public function messages(): array
    {
        return [
            'q.required' => 'A search query is required.',
            'q.min'      => 'Query must be at least 2 characters.',
            'q.max'      => 'Query must not exceed 200 characters.',
        ];
    }

    public function attributes(): array
    {
        return [
            'q'   => 'search query',
            'lat' => 'latitude',
            'lng' => 'longitude',
        ];
    }
}
