<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\DocumentType;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

/**
 * Principle: SRP — owns all upload quota logic including privilege bypass.
 * Storage: Redis via Cache facade (keys expire automatically at day/month boundary).
 *
 * Limits:
 *   - 5 uploads per section (passport/ninety_day_report/other) per calendar day — UI soft limit
 *   - 15 uploads total per calendar day (3 sections × 5) — server-enforced hard limit
 *   - 20 uploads total per calendar month — server-enforced hard limit
 *   - Privileged users: unlimited, all checks bypassed
 */
class DocumentUploadLimiterService
{
    public const DAILY_SECTION_LIMIT = 5;
    public const DAILY_TOTAL_LIMIT   = 15;
    public const MONTHLY_LIMIT       = 20;

    /**
     * Full stats shape consumed by the mobile upload UI.
     *
     * @return array{
     *   is_privileged: bool,
     *   monthly_used: int,
     *   monthly_limit: int|null,
     *   monthly_remaining: int|null,
     *   reset_date: string|null,
     *   sections: array<string, array{today_used: int, daily_limit: int|null}>
     * }
     */
    public function getStats(User $user): array
    {
        if ($user->isPrivileged()) {
            return $this->privilegedStats();
        }

        $monthlyUsed = (int) Cache::get($this->monthlyKey($user->id), 0);
        $sections    = [];

        foreach (DocumentType::cases() as $type) {
            $sections[$type->value] = [
                'today_used'  => (int) Cache::get($this->sectionDailyKey($user->id, $type), 0),
                'daily_limit' => self::DAILY_SECTION_LIMIT,
            ];
        }

        return [
            'is_privileged'     => false,
            'monthly_used'      => $monthlyUsed,
            'monthly_limit'     => self::MONTHLY_LIMIT,
            'monthly_remaining' => max(0, self::MONTHLY_LIMIT - $monthlyUsed),
            'reset_date'        => now()->addMonth()->startOfMonth()->format('Y-m-d'),
            'sections'          => $sections,
        ];
    }

    public function isAllowed(User $user): bool
    {
        if ($user->isPrivileged()) {
            return true;
        }

        $stats      = $this->getStats($user);
        $dailyTotal = array_sum(array_column($stats['sections'], 'today_used'));

        return $dailyTotal < self::DAILY_TOTAL_LIMIT
            && $stats['monthly_used'] < self::MONTHLY_LIMIT;
    }

    /**
     * Atomically increment counters for both the section daily key and the monthly key.
     * Cache::add() is a no-op if key exists, preserving existing TTL.
     * Cache::increment() is atomic on Redis.
     */
    public function increment(User $user, DocumentType $type): void
    {
        if ($user->isPrivileged()) {
            return;
        }

        $now = now();

        $sectionKey = $this->sectionDailyKey($user->id, $type);
        $dailyTtl   = (int) $now->diffInSeconds($now->copy()->endOfDay()) + 1;
        Cache::add($sectionKey, 0, $dailyTtl);
        Cache::increment($sectionKey);

        $monthlyKey = $this->monthlyKey($user->id);
        $monthlyTtl = (int) $now->diffInSeconds($now->copy()->endOfMonth()) + 1;
        Cache::add($monthlyKey, 0, $monthlyTtl);
        Cache::increment($monthlyKey);
    }

    private function privilegedStats(): array
    {
        $sections = [];
        foreach (DocumentType::cases() as $type) {
            $sections[$type->value] = ['today_used' => 0, 'daily_limit' => null];
        }

        return [
            'is_privileged'     => true,
            'monthly_used'      => 0,
            'monthly_limit'     => null,
            'monthly_remaining' => null,
            'reset_date'        => null,
            'sections'          => $sections,
        ];
    }

    private function sectionDailyKey(int $userId, DocumentType $type): string
    {
        return 'doc_upload:daily:' . $userId . ':' . $type->value . ':' . now()->format('Y-m-d');
    }

    private function monthlyKey(int $userId): string
    {
        return 'doc_upload:monthly:' . $userId . ':' . now()->format('Y-m');
    }
}
