<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminUploadPlaceImagesRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'images'   => ['required', 'array', 'min:1', 'max:10'],
            'images.*' => ['required', 'file', 'mimes:jpeg,png,webp', 'max:5120'], // 5 MB
        ];
    }

    public function attributes(): array
    {
        return ['images.*' => 'image file'];
    }
}
