<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\PaymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminPaymentIndexRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'status'    => ['sometimes', 'string', Rule::enum(PaymentStatus::class)],
            'date_from' => ['sometimes', 'date'],
            'date_to'   => ['sometimes', 'date', 'after_or_equal:date_from'],
            'per_page'  => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
