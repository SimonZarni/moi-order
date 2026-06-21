<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class UploadPaymentQrRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // merchant.auth middleware already asserts is_merchant
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $file = $this->file('qr_code');
        Log::info('QR upload debug', [
            'has_file'        => $this->hasFile('qr_code'),
            'all_files'       => array_keys($this->allFiles()),
            'all_input_keys'  => array_keys($this->all()),
            'mime'            => $file?->getMimeType(),
            'original_name'   => $file?->getClientOriginalName(),
            'client_mime'     => $file?->getClientMimeType(),
            'size'            => $file?->getSize(),
            'content_type'    => $this->header('Content-Type'),
        ]);

        return [
            'qr_code' => ['required', 'file', 'image', 'max:2048'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'qr_code.required' => 'A QR code image is required.',
            'qr_code.image'    => 'QR code must be a valid image (JPG, PNG, WebP, etc).',
            'qr_code.max'      => 'QR code image must not exceed 2 MB.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return ['qr_code' => 'payment QR code'];
    }
}
