<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Principle: SRP — validates one operation: creating a ticket order.
 * Security: visit_date max is today+6 days — enforced server-side, not just on the client.
 *   items.*.ticket_variant_id must exist and be active — prevents ordering inactive variants.
 */
class CreateTicketOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'ticket_id'      => ['required', 'integer', Rule::exists('tickets', 'id')->whereNull('deleted_at')],
            'visit_date'     => ['required', 'date_format:Y-m-d', 'after_or_equal:today', 'before_or_equal:' . now()->addDays(6)->toDateString()],
            'idempotency_key' => ['required', 'string', 'uuid'],
            'items'          => ['required', 'array', 'min:1'],
            'items.*.ticket_variant_id' => [
                'required',
                'integer',
                Rule::exists('ticket_variants', 'id')
                    ->where('is_active', true)
                    ->whereNull('deleted_at'),
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:15'],
        ];
    }

    public function messages(): array
    {
        return [
            'visit_date.after_or_equal'  => 'Visit date cannot be in the past.',
            'visit_date.before_or_equal' => 'Visit date cannot be more than 7 days from today.',
            'items.min'                  => 'At least one ticket variant must be selected.',
            'items.*.quantity.max'       => 'Maximum 15 tickets per variant.',
        ];
    }

    public function attributes(): array
    {
        return [
            'ticket_id'                  => 'ticket',
            'visit_date'                 => 'visit date',
            'idempotency_key'            => 'idempotency key',
            'items.*.ticket_variant_id'  => 'variant',
            'items.*.quantity'           => 'quantity',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Deduplicate items by variant ID — keep the last occurrence if user sends duplicates.
        if ($this->has('items') && is_array($this->items)) {
            $deduped = collect($this->items)
                ->keyBy('ticket_variant_id')
                ->values()
                ->all();
            $this->merge(['items' => $deduped]);
        }
    }
}
