<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Principle: SRP — HTTP only. Queries admin Sanctum tokens, returns session shape, delegates deletion.
 * Security: ensure.super_admin middleware on every route; destroy() guards against self-revocation.
 */
class AdminSessionController extends Controller
{
    /** GET /api/admin/v1/sessions — all active admin sessions ordered by last activity */
    public function index(Request $request): JsonResponse
    {
        $currentTokenId = $request->user()->currentAccessToken()->id;

        $sessions = PersonalAccessToken::query()
            ->where('name', 'admin-auth')
            ->where(function ($q): void {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->with('tokenable.adminRole')
            ->orderByDesc('last_used_at')
            ->get()
            ->map(fn (PersonalAccessToken $token) => $this->formatSession($token, $currentTokenId));

        return response()->json(['data' => $sessions]);
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
            ->where(function ($q): void {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->delete();

        return response()->json(null, 204);
    }

    private function formatSession(PersonalAccessToken $token, int $currentTokenId): array
    {
        $user = $token->tokenable;

        return [
            'id'           => $token->id,
            'is_current'   => $token->id === $currentTokenId,
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
}
