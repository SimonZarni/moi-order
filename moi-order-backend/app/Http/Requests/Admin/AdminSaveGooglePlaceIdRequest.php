<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validation + authorisation for the Save & Verify Google Place ID endpoint.
 */
class AdminSaveGooglePlaceIdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'google_place_id' => ['required', 'string', 'min:5', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'google_place_id.required' => 'A Google Place ID is required.',
        ];
    }

    public function attributes(): array
    {
        return [
            'google_place_id' => 'Google Place ID',
        ];
    }
}
