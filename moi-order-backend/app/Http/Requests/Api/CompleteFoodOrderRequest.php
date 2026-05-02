<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CompleteFoodOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'review' => ['nullable', 'string', 'max:500'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'rating.integer' => 'Rating must be a whole number.',
            'rating.min'     => 'Rating must be at least 1 star.',
            'rating.max'     => 'Rating cannot exceed 5 stars.',
            'review.max'     => 'Review cannot exceed 500 characters.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'rating' => 'rating',
            'review' => 'review',
        ];
    }
}
