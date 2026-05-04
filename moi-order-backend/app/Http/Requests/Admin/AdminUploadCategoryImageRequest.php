<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminUploadCategoryImageRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'image' => ['required', 'file', 'mimes:jpeg,png,webp', 'max:2048'],
        ];
    }

    public function attributes(): array
    {
        return ['image' => 'category image'];
    }
}
