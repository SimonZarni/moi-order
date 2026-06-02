<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Principle: SRP — validates one operation: creating a ticket order.
 * Security: visit_date max is today+2 years — enforced server-side, not just on the client.
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
            'visit_date'     => ['required', 'date_format:Y-m-d', 'after_or_equal:today', 'before_or_equal:' . now()->addDays(730)->toDateString()],
            'idempotency_key' => ['required', 'string', 'uuid'],
            'items'          => ['required', 'array', 'min:1'],
            'items.*.ticket_variant_id' => [
                'required',
                'integer',
                Rule::exists('ticket_variants', 'id')
                    ->where('is_active', true)
                    ->whereNull('deleted_at'),
            ],
            'items.*.quantity'    => ['required', 'integer', 'min:1', 'max:15'],
            'items.*.person_type' => ['required', 'string', Rule::in(['adult', 'child', 'general'])],
        ];
    }

    public function messages(): array
    {
        return [
            'visit_date.after_or_equal'  => 'Visit date cannot be in the past.',
            'visit_date.before_or_equal' => 'Visit date cannot be more than 2 years from today.',
            'items.min'                  => 'At least one ticket variant must be selected.',
            'items.*.quantity.max'       => 'Maximum 15 tickets per variant.',
            'items.*.person_type.in'     => 'Person type must be adult, child, or general.',
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
            'items.*.person_type'        => 'person type',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Deduplicate by variant+person_type — same variant can appear as adult and child.
        if ($this->has('items') && is_array($this->items)) {
            $deduped = collect($this->items)
                ->keyBy(fn (array $i) => ($i['ticket_variant_id'] ?? '') . '|' . ($i['person_type'] ?? ''))
                ->values()
                ->all();
            $this->merge(['items' => $deduped]);
        }
    }
}
