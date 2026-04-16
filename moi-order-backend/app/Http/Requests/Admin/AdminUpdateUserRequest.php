<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUpdateUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;

        return [
            'name'          => ['sometimes', 'string', 'max:255'],
            'email'         => ['sometimes', 'string', 'email:rfc', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'date_of_birth' => ['sometimes', 'nullable', 'date', 'before:today'],
        ];
    }

    public function attributes(): array
    {
        return ['date_of_birth' => 'date of birth'];
    }
}
