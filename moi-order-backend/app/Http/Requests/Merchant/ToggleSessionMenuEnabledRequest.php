<?php

declare(strict_types=1);

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class ToggleSessionMenuEnabledRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // auth handled by middleware; restaurant scope enforced in controller
    }

    public function rules(): array
    {
        return [
            'enabled' => ['required', 'boolean'],
        ];
    }
}
