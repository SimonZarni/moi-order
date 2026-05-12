<?php

declare(strict_types=1);

namespace App\Services\Admin;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Throwable;

class SystemHealthService
{
    public function check(): array
    {
        return [
            'services'    => $this->checkServices(),
            'server'      => $this->serverMetrics(),
            'app'         => $this->appInfo(),
            'queue'       => $this->queueStatus(),
            'failed_jobs' => $this->recentFailedJobs(),
            'schedule'    => $this->scheduledTasks(),
            'checked_at'  => now()->toISOString(),
        ];
    }

    // ── External service probes ───────────────────────────────────────────────

    private function checkServices(): array
    {
        return [
            $this->probe('MySQL',         fn () => DB::connection()->getPdo()),
            $this->probe('Redis',         fn () => Redis::ping()),
            $this->probe('Cloudflare R2', fn () => Storage::disk('s3')->exists('health-probe.txt')),
            $this->probe('Pusher',        fn () => $this->pingPusher()),
            $this->probe('Stripe',        fn () => $this->pingStripe()),
            $this->probe('ThaiBulkSMS',   fn () => $this->pingThaiBulkSms()),
            $this->probe('Zoho SMTP',     fn () => $this->pingSmtp()),
        ];
    }

    private function probe(string $name, callable $fn): array
    {
        $start = microtime(true);
        try {
            $fn();
            return [
                'name'       => $name,
                'status'     => 'ok',
                'latency_ms' => (int) round((microtime(true) - $start) * 1000),
                'message'    => null,
            ];
        } catch (Throwable $e) {
            return [
                'name'       => $name,
                'status'     => 'error',
                'latency_ms' => (int) round((microtime(true) - $start) * 1000),
                'message'    => $e->getMessage(),
            ];
        }
    }

    private function pingPusher(): void
    {
        $appId   = config('broadcasting.connections.pusher.app_id');
        $key     = config('broadcasting.connections.pusher.key');
        $secret  = config('broadcasting.connections.pusher.secret');
        $cluster = config('broadcasting.connections.pusher.options.cluster', 'mt1');
        $path    = "/apps/{$appId}/channels";
        $ts      = time();
        $params  = "auth_key={$key}&auth_timestamp={$ts}&auth_version=1.0";
        $sig     = hash_hmac('sha256', "GET\n{$path}\n{$params}", $secret);

        $response = Http::timeout(5)->get(
            "https://api-{$cluster}.pusher.com{$path}?{$params}&auth_signature={$sig}"
        );

        if (! $response->successful()) {
            throw new \RuntimeException("HTTP {$response->status()}");
        }
    }

    private function pingStripe(): void
    {
        $response = Http::timeout(5)
            ->withBasicAuth(config('services.stripe.secret'), '')
            ->get('https://api.stripe.com/v1/balance');

        if (! $response->successful()) {
            throw new \RuntimeException("HTTP {$response->status()}");
        }
    }

    private function pingThaiBulkSms(): void
    {
        $response = Http::timeout(5)
            ->asForm()
            ->post('https://www.thaibulksms.com/api/wallet.php', [
                'key'    => config('services.thaibulksms.key'),
                'secret' => config('services.thaibulksms.secret'),
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException("HTTP {$response->status()}");
        }
    }

    private function pingSmtp(): void
    {
        $host = (string) config('mail.mailers.smtp.host', '');

        if ($host === '') {
            throw new \RuntimeException('SMTP host not configured');
        }

        $port   = (int) config('mail.mailers.smtp.port', 587);
        $socket = @fsockopen($host, $port, $errno, $errstr, 3);

        if (! $socket) {
            throw new \RuntimeException("{$errstr} ({$errno})");
        }

        fclose($socket);
    }

    // ── Server metrics ────────────────────────────────────────────────────────

    private function serverMetrics(): array
    {
        $load      = sys_getloadavg() ?: [0.0, 0.0, 0.0];
        $diskFree  = (float) (@disk_free_space('/') ?: 0);
        $diskTotal = (float) (@disk_total_space('/') ?: 0);

        return [
            'load_1'          => round($load[0], 2),
            'load_5'          => round($load[1], 2),
            'load_15'         => round($load[2], 2),
            'cpu_count'       => $this->cpuCount(),
            'memory_total_mb' => $this->memoryInfo()['total'],
            'memory_used_mb'  => $this->memoryInfo()['used'],
            'memory_free_mb'  => $this->memoryInfo()['free'],
            'disk_total_gb'   => round($diskTotal / 1_073_741_824, 1),
            'disk_used_gb'    => round(($diskTotal - $diskFree) / 1_073_741_824, 1),
            'disk_free_gb'    => round($diskFree  / 1_073_741_824, 1),
        ];
    }

    private function cpuCount(): int
    {
        if (! is_readable('/proc/cpuinfo')) {
            return 1;
        }
        // Count "processor : N" occurrences — one per logical core
        return max(1, substr_count((string) file_get_contents('/proc/cpuinfo'), "\nprocessor"));
    }

    private function memoryInfo(): array
    {
        static $cached = null;

        if ($cached !== null) {
            return $cached;
        }

        if (! is_readable('/proc/meminfo')) {
            return $cached = ['total' => 0, 'used' => 0, 'free' => 0];
        }

        $mem = [];
        foreach (file('/proc/meminfo', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            [$key, $val] = explode(':', $line, 2);
            $mem[trim($key)] = (int) trim($val); // "3996548 kB" → 3996548
        }

        $totalKb     = $mem['MemTotal']     ?? 0;
        $availableKb = $mem['MemAvailable'] ?? ($mem['MemFree'] ?? 0);

        return $cached = [
            'total' => (int) round($totalKb / 1024),
            'used'  => (int) round(($totalKb - $availableKb) / 1024),
            'free'  => (int) round($availableKb / 1024),
        ];
    }

    // ── Application info ──────────────────────────────────────────────────────

    private function appInfo(): array
    {
        return [
            'laravel_version'  => app()->version(),
            'php_version'      => PHP_VERSION,
            'env'              => config('app.env'),
            'debug'            => (bool) config('app.debug'),
            'cache_driver'     => config('cache.default'),
            'queue_connection' => config('queue.default'),
            'timezone'         => config('app.timezone'),
        ];
    }

    // ── Queue status ──────────────────────────────────────────────────────────

    private function queueStatus(): array
    {
        $heartbeatAt = Cache::get('queue:heartbeat_at');
        $ageSeconds  = $heartbeatAt !== null ? (int) now()->diffInSeconds($heartbeatAt) : null;

        $depths = [];
        foreach (['default', 'notifications'] as $queue) {
            try {
                $depth = (int) Redis::llen("queues:{$queue}");
            } catch (Throwable) {
                $depth = null;
            }
            $depths[] = ['queue' => $queue, 'depth' => $depth];
        }

        return [
            'worker_alive'          => $ageSeconds !== null && $ageSeconds <= 90,
            'last_heartbeat_at'     => $heartbeatAt,
            'heartbeat_age_seconds' => $ageSeconds,
            'depths'                => $depths,
            'failed_count'          => (int) DB::table('failed_jobs')->count(),
        ];
    }

    private function recentFailedJobs(): array
    {
        return DB::table('failed_jobs')
            ->orderByDesc('failed_at')
            ->limit(10)
            ->get(['id', 'queue', 'payload', 'failed_at'])
            ->map(static function (object $job): array {
                $payload = json_decode($job->payload, true) ?? [];
                return [
                    'id'        => $job->id,
                    'queue'     => $job->queue,
                    'job_class' => $payload['displayName'] ?? ($payload['job'] ?? 'Unknown'),
                    'failed_at' => $job->failed_at,
                ];
            })
            ->toArray();
    }

    // ── Schedule ──────────────────────────────────────────────────────────────

    private function scheduledTasks(): array
    {
        $tasks = [];

        foreach (app(Schedule::class)->events() as $event) {
            $nextRun = null;
            try {
                $nextRun = $event->nextRunDate()->toISOString();
            } catch (Throwable) {
                // some events have dynamic next-run dates
            }

            $summary = method_exists($event, 'getSummaryForDisplay')
                ? $event->getSummaryForDisplay()
                : (string) ($event->command ?? 'Unknown');

            $tasks[] = [
                'command'     => $summary,
                'expression'  => $event->expression,
                'next_run_at' => $nextRun,
                'timezone'    => $event->timezone ?? config('app.timezone'),
            ];
        }

        return $tasks;
    }
}
