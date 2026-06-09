<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates per-payment QR image upload only.
 */
class UploadPerPaymentQrRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route is guarded by check.permission:payments.manage middleware
    }

    public function rules(): array
    {
        return [
            'image' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    public function attributes(): array
    {
        return [
            'image' => 'QR image',
        ];
    }

    public function messages(): array
    {
        return [
            'image.max' => 'The QR image must not exceed 5 MB.',
        ];
    }
}
