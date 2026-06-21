<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class UploadPaymentQrRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // merchant.auth middleware already asserts is_merchant
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'qr_code' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'qr_code.required' => 'A QR code image is required.',
            'qr_code.mimes'    => 'QR code must be a JPG, PNG, or WebP image.',
            'qr_code.max'      => 'QR code image must not exceed 2 MB.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return ['qr_code' => 'payment QR code'];
    }
}
