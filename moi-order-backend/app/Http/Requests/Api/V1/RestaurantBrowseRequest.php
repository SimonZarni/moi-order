<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class RestaurantBrowseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // intentionally public
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'lat'    => ['nullable', 'numeric', 'between:-90,90'],
            'lng'    => ['nullable', 'numeric', 'between:-180,180'],
            'search' => ['nullable', 'string', 'max:100'],
            'page'   => ['nullable', 'integer', 'min:1'],
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'lat'    => 'latitude',
            'lng'    => 'longitude',
            'search' => 'search query',
        ];
    }
}
