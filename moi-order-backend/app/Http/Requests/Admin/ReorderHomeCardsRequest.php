<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ReorderHomeCardsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order'    => ['required', 'array', 'min:1'],
            'order.*'  => ['required', 'integer', 'exists:home_cards,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'order'   => 'card order',
            'order.*' => 'card ID',
        ];
    }

    public function messages(): array
    {
        return [
            'order.*.exists' => 'One or more card IDs are invalid.',
        ];
    }
}
