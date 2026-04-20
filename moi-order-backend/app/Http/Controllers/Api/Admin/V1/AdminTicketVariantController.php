<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketVariantResource;
use App\Models\Ticket;
use App\Models\TicketVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. Admin CRUD for ticket variants. ≤20 lines/action.
 */
class AdminTicketVariantController extends Controller
{
    public function index(Ticket $ticket): JsonResponse
    {
        return response()->json([
            'data' => TicketVariantResource::collection($ticket->variants),
        ]);
    }

    public function store(Request $request, Ticket $ticket): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price'       => ['required', 'integer', 'min:1'],
            'is_active'   => ['boolean'],
            'sort_order'  => ['integer', 'min:0'],
        ]);

        $variant = $ticket->variants()->create($data);

        return response()->json(['data' => new TicketVariantResource($variant)], 201);
    }

    public function update(Request $request, Ticket $ticket, TicketVariant $variant): JsonResponse
    {
        abort_if($variant->ticket_id !== $ticket->id, 404);

        $data = $request->validate([
            'name'        => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'price'       => ['sometimes', 'integer', 'min:1'],
            'is_active'   => ['sometimes', 'boolean'],
            'sort_order'  => ['sometimes', 'integer', 'min:0'],
        ]);

        $variant->update($data);

        return response()->json(['data' => new TicketVariantResource($variant->fresh())]);
    }

    public function destroy(Ticket $ticket, TicketVariant $variant): JsonResponse
    {
        abort_if($variant->ticket_id !== $ticket->id, 404);
        $variant->delete();
        return response()->json(null, 204);
    }
}
