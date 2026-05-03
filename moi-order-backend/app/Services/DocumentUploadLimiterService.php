<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Principle: SRP — owns daily and monthly upload quota tracking per user.
 * Storage: Redis via Cache facade (keys expire automatically).
 *
 * Limits are intentionally not exposed in error messages or API responses
 * so users cannot game the system. Warnings are shown only when approaching.
 */
class DocumentUploadLimiterService
{
    public const DAILY_LIMIT     = 20;
    public const MONTHLY_LIMIT   = 30;
    public const DAILY_WARN_AT   = 10;  // show warning when used >= this
    public const MONTHLY_WARN_AT = 23;  // show warning when used >= this

    /**
     * @return array{ daily_used: int, daily_remaining: int, monthly_used: int, monthly_remaining: int }
     */
    public function getQuota(int $userId): array
    {
        $dailyUsed   = (int) Cache::get($this->dailyKey($userId), 0);
        $monthlyUsed = (int) Cache::get($this->monthlyKey($userId), 0);

        return [
            'daily_used'        => $dailyUsed,
            'daily_remaining'   => max(0, self::DAILY_LIMIT - $dailyUsed),
            'monthly_used'      => $monthlyUsed,
            'monthly_remaining' => max(0, self::MONTHLY_LIMIT - $monthlyUsed),
        ];
    }

    public function isAllowed(int $userId): bool
    {
        $quota = $this->getQuota($userId);
        return $quota['daily_used'] < self::DAILY_LIMIT
            && $quota['monthly_used'] < self::MONTHLY_LIMIT;
    }

    /**
     * Atomically increment counters.
     * Cache::add() is a no-op if key exists, preserving existing TTL.
     * Cache::increment() is atomic on Redis.
     */
    public function increment(int $userId): void
    {
        $now = now();

        $dailyKey = $this->dailyKey($userId);
        $dailyTtl = (int) $now->diffInSeconds($now->copy()->endOfDay()) + 1;
        Cache::add($dailyKey, 0, $dailyTtl);
        Cache::increment($dailyKey);

        $monthlyKey = $this->monthlyKey($userId);
        $monthlyTtl = (int) $now->diffInSeconds($now->copy()->endOfMonth()) + 1;
        Cache::add($monthlyKey, 0, $monthlyTtl);
        Cache::increment($monthlyKey);
    }

    private function dailyKey(int $userId): string
    {
        return 'doc_upload:daily:' . $userId . ':' . now()->format('Y-m-d');
    }

    private function monthlyKey(int $userId): string
    {
        return 'doc_upload:monthly:' . $userId . ':' . now()->format('Y-m');
    }
}
