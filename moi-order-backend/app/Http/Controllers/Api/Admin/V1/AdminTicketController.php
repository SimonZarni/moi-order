<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. Admin CRUD for tickets. ≤20 lines/action.
 * Security: cover_image stored via FileStorageInterface — never Storage::disk() directly.
 */
class AdminTicketController extends Controller
{
    public function __construct(
        private readonly FileStorageInterface $fileStorage,
    ) {}

    public function index(): JsonResponse
    {
        $tickets = Ticket::withTrashed()->orderBy('sort_order')->paginate(20);

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

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'                  => ['required', 'string', 'max:255'],
            'highlight_description' => ['required', 'string', 'max:500'],
            'description'           => ['required', 'string'],
            'google_maps_link'      => ['required', 'string', 'max:2048'],
            'address'               => ['required', 'string', 'max:500'],
            'city'                  => ['required', 'string', 'max:100'],
            'province'              => ['required', 'string', 'max:100'],
            'cover_image'           => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'is_active'             => ['boolean'],
            'sort_order'            => ['integer', 'min:0'],
        ]);

        $path = $this->fileStorage->store($request->file('cover_image'), 'tickets');

        $ticket = Ticket::create(array_merge(
            collect($data)->except('cover_image')->all(),
            ['cover_image_path' => $path],
        ));

        return response()->json(['data' => new TicketResource($ticket)], 201);
    }

    public function show(Ticket $ticket): JsonResponse
    {
        $ticket->load('activeVariants');
        return response()->json(['data' => new TicketResource($ticket)]);
    }

    public function update(Request $request, Ticket $ticket): JsonResponse
    {
        $data = $request->validate([
            'name'                  => ['sometimes', 'string', 'max:255'],
            'highlight_description' => ['sometimes', 'string', 'max:500'],
            'description'           => ['sometimes', 'string'],
            'google_maps_link'      => ['sometimes', 'string', 'max:2048'],
            'address'               => ['sometimes', 'string', 'max:500'],
            'city'                  => ['sometimes', 'string', 'max:100'],
            'province'              => ['sometimes', 'string', 'max:100'],
            'cover_image'           => ['sometimes', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'is_active'             => ['sometimes', 'boolean'],
            'sort_order'            => ['sometimes', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('cover_image')) {
            if ($ticket->cover_image_path !== null) {
                $this->fileStorage->delete($ticket->cover_image_path);
            }
            $data['cover_image_path'] = $this->fileStorage->store($request->file('cover_image'), 'tickets');
            unset($data['cover_image']);
        }

        $ticket->update($data);

        return response()->json(['data' => new TicketResource($ticket->fresh())]);
    }

    public function destroy(Ticket $ticket): JsonResponse
    {
        $ticket->delete();
        return response()->json(null, 204);
    }
}
