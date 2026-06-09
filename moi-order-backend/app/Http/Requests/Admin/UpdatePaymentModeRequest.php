<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\PaymentMode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Principle: SRP — validates payment mode switch only.
 */
class UpdatePaymentModeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route is guarded by ensure.super_admin middleware
    }

    public function rules(): array
    {
        return [
            'mode'                 => ['required', Rule::enum(PaymentMode::class)],
            'bank_name'            => ['nullable', 'string', 'max:100'],
            'bank_account_number'  => ['nullable', 'string', 'max:50'],
            'bank_account_name'    => ['nullable', 'string', 'max:100'],
        ];
    }

    public function attributes(): array
    {
        return [
            'mode'                => 'payment mode',
            'bank_name'           => 'bank name',
            'bank_account_number' => 'bank account number',
            'bank_account_name'   => 'bank account name',
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
