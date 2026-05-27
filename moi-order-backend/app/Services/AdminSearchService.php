<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Payment;
use App\Models\ServiceSubmission;
use App\Models\TicketOrder;
use App\Models\User;

/**
 * Principle: SRP — cross-entity search logic only.
 * Principle: KISS — returns plain arrays; no Resource overhead for a 5-item-per-group summary.
 * Performance: all queries use indexed columns (name, email, id, stripe_intent_id).
 *   N+1 prevention: eager-loads every relationship used in the map.
 */
class AdminSearchService
{
    private const LIMIT      = 5;
    private const MIN_LENGTH = 2;

    public function search(string $query): array
    {
        $query = trim($query);

        if (mb_strlen($query) < self::MIN_LENGTH) {
            return $this->empty();
        }

        $term = '%' . $query . '%';
        $isId = ctype_digit($query) && (int) $query > 0;

        return [
            'users'       => $this->searchUsers($term),
            'submissions' => $this->searchSubmissions($term, $isId, $query),
            'bookings'    => $this->searchBookings($term, $isId, $query),
            'payments'    => $this->searchPayments($term, $isId, $query),
        ];
    }

    private function searchUsers(string $term): array
    {
        return User::withTrashed()
            ->where('name', 'like', $term)
            ->orWhere('email', 'like', $term)
            ->limit(self::LIMIT)
            ->get()
            ->map(fn (User $u) => [
                'id'           => $u->id,
                'name'         => $u->name,
                'email'        => $u->email,
                'status'       => $u->status->value,
                'status_label' => $u->status->label(),
                'is_deleted'   => $u->deleted_at !== null,
            ])
            ->all();
    }

    private function searchSubmissions(string $term, bool $isId, string $query): array
    {
        return ServiceSubmission::with(['user', 'serviceType.service'])
            ->where(function ($q) use ($term, $isId, $query): void {
                if ($isId) {
                    $q->where('id', (int) $query);
                }
                $q->orWhereHas('user', fn ($uq) => $uq
                    ->where('name', 'like', $term)
                    ->orWhere('email', 'like', $term)
                );
            })
            ->orderByDesc('created_at')
            ->limit(self::LIMIT)
            ->get()
            ->map(fn (ServiceSubmission $s) => [
                'id'           => $s->id,
                'service_name' => $s->serviceType?->service?->name ?? $s->serviceType?->name ?? '—',
                'type_name'    => $s->serviceType?->name ?? null,
                'status'       => $s->status->value,
                'status_label' => $s->status->label(),
                'user_name'    => $s->user?->name ?? '—',
                'created_at'   => $s->created_at->toISOString(),
            ])
            ->all();
    }

    private function searchBookings(string $term, bool $isId, string $query): array
    {
        return TicketOrder::with(['user', 'ticket'])
            ->where(function ($q) use ($term, $isId, $query): void {
                if ($isId) {
                    $q->where('id', (int) $query);
                }
                $q->orWhereHas('user', fn ($uq) => $uq
                    ->where('name', 'like', $term)
                    ->orWhere('email', 'like', $term)
                )
                ->orWhereHas('ticket', fn ($tq) => $tq->where('name', 'like', $term));
            })
            ->orderByDesc('created_at')
            ->limit(self::LIMIT)
            ->get()
            ->map(fn (TicketOrder $b) => [
                'id'           => $b->id,
                'ticket_name'  => $b->ticket?->name ?? '—',
                'status'       => $b->status->value,
                'status_label' => $b->status->label(),
                'visit_date'   => $b->visit_date,
                'user_name'    => $b->user?->name ?? '—',
                'created_at'   => $b->created_at->toISOString(),
            ])
            ->all();
    }

    private function searchPayments(string $term, bool $isId, string $query): array
    {
        return Payment::query()
            ->where(function ($q) use ($term, $isId, $query): void {
                if ($isId) {
                    $q->where('id', (int) $query);
                }
                $q->orWhere('stripe_intent_id', 'like', $term);
            })
            ->orderByDesc('created_at')
            ->limit(self::LIMIT)
            ->get()
            ->map(fn (Payment $p) => [
                'id'           => $p->id,
                'amount'       => $p->amount,
                'currency'     => $p->currency,
                'status'       => $p->status->value,
                'status_label' => $p->status->label(),
                'created_at'   => $p->created_at->toISOString(),
            ])
            ->all();
    }

    private function empty(): array
    {
        return ['users' => [], 'submissions' => [], 'bookings' => [], 'payments' => []];
    }
}
