<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * GET /api/v1/tickets and /api/v1/tickets/{id} — intentionally public (no auth required).
 */
class TicketController extends Controller
{
    public function index(): JsonResponse
    {
        $tickets = Ticket::active()
            ->orderBy('sort_order')
            ->paginate(20);

        return response()->json([
            'data' => TicketResource::collection($tickets->items()),
            'meta' => [
                'current_page' => $tickets->currentPage(),
                'last_page'    => $tickets->lastPage(),
                'per_page'     => $tickets->perPage(),
                'total'        => $tickets->total(),
            ],
        ]);
    }

    public function show(Ticket $ticket): JsonResponse
    {
        abort_if(! $ticket->is_active, 404);

        $ticket->load('activeVariants');

        return response()->json(['data' => new TicketResource($ticket)]);
    }
}
