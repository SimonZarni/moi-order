<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RemoveEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'otp' => ['required', 'string', 'size:6'],
        ];
    }

    public function attributes(): array
    {
        return [
            'otp' => 'verification code',
        ];
    }

    public function messages(): array
    {
        return [
            'otp.size' => 'The verification code must be exactly 6 digits.',
        ];
    }
}
