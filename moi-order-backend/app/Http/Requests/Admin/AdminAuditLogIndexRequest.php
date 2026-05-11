<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\AuditAction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminAuditLogIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // middleware handles authentication; no Policy needed for read-only list
    }

    public function rules(): array
    {
        return [
            'admin_id'    => ['sometimes', 'integer', 'min:1'],
            'action'      => ['sometimes', 'string', Rule::enum(AuditAction::class)],
            'entity_type' => ['sometimes', 'string', 'max:100'],
            'date_from'   => ['sometimes', 'date'],
            'date_to'     => ['sometimes', 'date', 'after_or_equal:date_from'],
            'search'      => ['sometimes', 'string', 'max:100'],
            'per_page'    => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
