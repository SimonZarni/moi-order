<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validation + authorisation for the Google Place search endpoint only.
 */
class AdminSearchGooglePlaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // AdminAuthenticate middleware already guards the route
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Place name is required.',
            'city.required' => 'City is required.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'place name',
            'city' => 'city',
        ];
    }
}
