<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UploadDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type'  => ['required', 'string', new Enum(DocumentType::class)],
            'image' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ];
    }

    public function attributes(): array
    {
        return [
            'type'  => 'document type',
            'image' => 'document image',
        ];
    }

    public function messages(): array
    {
        return [
            'image.mimes' => 'Please upload a JPEG, PNG, or WebP image.',
            'image.max'   => 'Image must be under 10 MB.',
        ];
    }
}
