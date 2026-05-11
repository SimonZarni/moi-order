<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\AppAlertFrequency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInAppAlertRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title'     => ['required', 'string', 'max:255'],
            'message'   => ['required', 'string', 'max:1000'],
            'frequency' => ['required', 'string', Rule::enum(AppAlertFrequency::class)],
            'is_active' => ['boolean'],
        ];
    }
}
