<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use App\Enums\KycDocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

/**
 * Principle: SRP — validation + authorisation for KYC document upload.
 * Principle: Security — MIME validated again server-side in KycService (not just FormRequest).
 */
class UploadKycDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'type' => ['required', new Enum(KycDocumentType::class)],
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:51200'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'type.required' => 'Document type is required.',
            'file.required' => 'A file must be uploaded.',
            'file.mimes'    => 'File must be a JPG, PNG, or PDF.',
            'file.max'      => 'File may not exceed 10 MB.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'type' => 'document type',
            'file' => 'document file',
        ];
    }
}
