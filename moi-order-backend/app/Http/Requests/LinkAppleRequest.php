<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LinkAppleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'id_token' => ['required', 'string'],
            'email'    => ['sometimes', 'nullable', 'email:rfc,dns', 'max:255'],
            'name'     => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
