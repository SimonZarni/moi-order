<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class VerifyAdminOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ensure.super_admin middleware guards the route.
    }

    /** @return array<string,mixed> */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255'],
            'otp'   => ['required', 'string', 'digits:6'],
        ];
    }
}
