<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmailOtpRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'   => ['required', 'string', 'email:rfc,dns', 'max:255'],
            'purpose' => ['required', Rule::in(['login', 'register'])],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Please enter a valid email address.',
        ];
    }

    public function attributes(): array
    {
        return [
            'email'   => 'email address',
            'purpose' => 'purpose',
        ];
    }
}
