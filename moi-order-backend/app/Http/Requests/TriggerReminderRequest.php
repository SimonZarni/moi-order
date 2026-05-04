<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — authorizes the test-trigger operation only.
 * Security: privileged accounts only; regular users get 403.
 */
class TriggerReminderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isPrivileged();
    }

    public function rules(): array
    {
        return [];
    }
}
