<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Principle: SRP — HTTP only. Queries admin Sanctum tokens, returns session shape, delegates deletion.
 * Security: ensure.super_admin middleware on every route; destroy() guards against self-revocation.
 */
class AdminSessionController extends Controller
{
    private const PER_PAGE = 5;

    /** GET /api/admin/v1/sessions — paginated active admin sessions ordered by last activity */
    public function index(Request $request): JsonResponse
    {
        $currentTokenId = $request->user()->currentAccessToken()->id;

        $paginator = PersonalAccessToken::query()
            ->where('name', 'admin-auth')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->with('tokenable.adminRole')
            ->orderByDesc('last_used_at')
            ->paginate(self::PER_PAGE);

        /** @var PersonalAccessToken[] $items */
        $items = $paginator->items();

        $cityMap = $this->resolveLocations(
            collect($items)->pluck('ip_address')->filter()->unique()->values()->all()
        );

        $sessions = collect($items)
            ->map(fn (PersonalAccessToken $token) => $this->formatSession($token, $currentTokenId, $cityMap));

        return response()->json([
            'data' => $sessions,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    /** DELETE /api/admin/v1/sessions/{tokenId} — revoke a specific admin session */
    public function destroy(Request $request, int $tokenId): JsonResponse
    {
        $currentTokenId = $request->user()->currentAccessToken()->id;

        if ($tokenId === $currentTokenId) {
            return response()->json([
                'message' => 'Cannot revoke your own active session.',
                'code'    => 'session.cannot_revoke_self',
            ], 409);
        }

        $token = PersonalAccessToken::where('name', 'admin-auth')->findOrFail($tokenId);
        $token->delete();

        return response()->json(null, 204);
    }

    /** DELETE /api/admin/v1/sessions/others — revoke every admin session except the caller's */
    public function destroyOthers(Request $request): JsonResponse
    {
        $currentTokenId = $request->user()->currentAccessToken()->id;

        PersonalAccessToken::query()
            ->where('name', 'admin-auth')
            ->where('id', '!=', $currentTokenId)
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->delete();

        return response()->json(null, 204);
    }

    /** @param array<string, string> $cityMap */
    private function formatSession(PersonalAccessToken $token, int $currentTokenId, array $cityMap): array
    {
        $user = $token->tokenable;

        return [
            'id'           => $token->id,
            'is_current'   => $token->id === $currentTokenId,
            'device'       => $token->user_agent ? $this->parseDevice($token->user_agent) : null,
            'ip_address'   => $token->ip_address,
            'location'     => $token->ip_address ? ($cityMap[$token->ip_address] ?? $token->ip_address) : null,
            'last_used_at' => $token->last_used_at?->toISOString(),
            'created_at'   => $token->created_at->toISOString(),
            'expires_at'   => $token->expires_at?->toISOString(),
            'admin'        => $user ? [
                'id'    => $user->uuid,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->adminRole ? [
                    'slug'  => $user->adminRole->slug,
                    'label' => $user->adminRole->label,
                ] : null,
            ] : null,
        ];
    }

    /**
     * Resolve IP addresses to city strings concurrently via ip-api.com with 24 h cache per IP.
     * All uncached IPs are fetched in a single HTTP pool — worst-case latency is one round-trip
     * (2 s timeout) regardless of the number of unique IPs on the page.
     *
     * @param  string[] $ips
     * @return array<string, string>
     */
    private function resolveLocations(array $ips): array
    {
        $cityMap = [];
        $toFetch = [];

        foreach ($ips as $ip) {
            if (in_array($ip, ['127.0.0.1', '::1'], true)) {
                $cityMap[$ip] = 'Local';
                continue;
            }
            $cached = Cache::get("ip_city_{$ip}");
            if ($cached !== null) {
                $cityMap[$ip] = $cached;
            } else {
                $toFetch[] = $ip;
            }
        }

        if (empty($toFetch)) {
            return $cityMap;
        }

        try {
            $responses = Http::pool(fn (Pool $pool) => array_map(
                fn (string $ip) => $pool->as($ip)->timeout(2)
                    ->get("http://ip-api.com/json/{$ip}", ['fields' => 'city,country,status']),
                $toFetch,
            ));

            foreach ($toFetch as $ip) {
                $city = $ip;
                try {
                    $resp = $responses[$ip];
                    if ($resp->successful()) {
                        $data = $resp->json();
                        if (($data['status'] ?? '') === 'success') {
                            $parts = array_filter([$data['city'] ?? null, $data['country'] ?? null]);
                            $city  = implode(', ', $parts) ?: $ip;
                        }
                    }
                } catch (\Throwable) {
                    // Individual IP lookup failed — fall back to raw IP.
                }

                Cache::put("ip_city_{$ip}", $city, now()->addDay());
                $cityMap[$ip] = $city;
            }
        } catch (\Throwable) {
            // Pool itself failed — return raw IPs for all uncached entries.
            foreach ($toFetch as $ip) {
                $cityMap[$ip] = $ip;
            }
        }

        return $cityMap;
    }

    private function parseDevice(string $userAgent): string
    {
        $ua = strtolower($userAgent);

        $browser = match (true) {
            str_contains($ua, 'edg/')                                        => 'Edge',
            str_contains($ua, 'opr/') || str_contains($ua, 'opera')         => 'Opera',
            str_contains($ua, 'chrome') && ! str_contains($ua, 'chromium')  => 'Chrome',
            str_contains($ua, 'firefox')                                     => 'Firefox',
            str_contains($ua, 'safari') && ! str_contains($ua, 'chrome')    => 'Safari',
            str_contains($ua, 'trident') || str_contains($ua, 'msie')       => 'IE',
            default                                                           => 'Browser',
        };

        $os = match (true) {
            str_contains($ua, 'windows')                                      => 'Windows',
            str_contains($ua, 'macintosh') || str_contains($ua, 'mac os x')  => 'macOS',
            str_contains($ua, 'android')                                      => 'Android',
            str_contains($ua, 'iphone') || str_contains($ua, 'ipad')         => 'iOS',
            str_contains($ua, 'linux')                                        => 'Linux',
            default                                                            => 'Unknown OS',
        };

        return "{$browser} · {$os}";
    }
}
