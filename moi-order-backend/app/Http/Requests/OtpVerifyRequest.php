<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OtpVerifyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'otp_request_id' => ['required', 'string', 'uuid'],
            'phone_number'   => ['required', 'string', 'max:20'],
            'pin'            => ['required', 'string', 'max:10'],
            'purpose'        => ['required', Rule::in(['login', 'register'])],
            'name'           => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
