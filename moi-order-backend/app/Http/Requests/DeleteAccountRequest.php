<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — authorises and validates the delete-account operation only.
 * Security: auth already enforced by auth:sanctum middleware; this request
 *   carries no payload — it is purely a guard for explicit authorisation.
 */
class DeleteAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [];
    }
}
