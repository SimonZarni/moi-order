<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates one operation: uploading a PDF e-ticket.
 * Security: MIME whitelist enforced here AND in FileStorageService (defence in depth).
 *   Max 20 MB: large e-ticket PDFs with embedded graphics are common.
 */
class UploadEticketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_admin === true;
    }

    public function rules(): array
    {
        return [
            'eticket' => ['required', 'file', 'mimes:pdf,jpeg,jpg,png', 'max:20480'],
        ];
    }

    public function attributes(): array
    {
        return [
            'eticket' => 'e-ticket file',
        ];
    }
}
