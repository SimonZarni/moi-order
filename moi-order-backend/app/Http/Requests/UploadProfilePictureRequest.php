<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadProfilePictureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'picture' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'picture.required' => 'Please select a photo.',
            'picture.file'     => 'The upload must be a file.',
            'picture.mimes'    => 'Only JPEG, PNG, and WebP images are accepted.',
            'picture.max'      => 'Photo must be smaller than 5 MB.',
        ];
    }

    public function attributes(): array
    {
        return ['picture' => 'profile picture'];
    }
}
