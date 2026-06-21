<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmCashOutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // admin.auth middleware already asserts is_admin
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return []; // no body required — invoice id is a route param
    }
}
