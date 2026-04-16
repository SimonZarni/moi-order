<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminReorderPlaceImagesRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'images'              => ['required', 'array', 'min:1'],
            'images.*.id'         => ['required', 'integer', Rule::exists('place_images', 'id')],
            'images.*.sort_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
