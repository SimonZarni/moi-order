<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\HomeCardDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderHomeCardsRequest;
use App\Http\Requests\Admin\StoreHomeCardRequest;
use App\Http\Requests\Admin\UpdateHomeCardRequest;
use App\Http\Resources\Admin\AdminHomeCardResource;
use App\Models\HomeCard;
use App\Services\HomeCardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminHomeCardController extends Controller
{
    public function __construct(private readonly HomeCardService $service) {}

    /** GET /api/admin/v1/home-cards */
    public function index(Request $request): AnonymousResourceCollection
    {
        return AdminHomeCardResource::collection(
            $this->service->indexForAdmin($request->integer('per_page', 100))
        );
    }

    /** POST /api/admin/v1/home-cards */
    public function store(StoreHomeCardRequest $request): JsonResponse
    {
        $card = $this->service->store(HomeCardDTO::fromStoreRequest($request));

        return response()->json(['data' => new AdminHomeCardResource($card)], 201);
    }

    /** GET /api/admin/v1/home-cards/{homeCard} */
    public function show(HomeCard $homeCard): JsonResponse
    {
        return response()->json(['data' => new AdminHomeCardResource($this->service->show($homeCard))]);
    }

    /** PUT /api/admin/v1/home-cards/{homeCard} */
    public function update(UpdateHomeCardRequest $request, HomeCard $homeCard): JsonResponse
    {
        $card = $this->service->update($homeCard, HomeCardDTO::fromUpdateRequest($request));

        return response()->json(['data' => new AdminHomeCardResource($card)]);
    }

    /** DELETE /api/admin/v1/home-cards/{homeCard} */
    public function destroy(HomeCard $homeCard): JsonResponse
    {
        $this->service->destroy($homeCard);

        return response()->json(null, 204);
    }

    /** PATCH /api/admin/v1/home-cards/{id}/restore */
    public function restore(int $id): JsonResponse
    {
        $card = HomeCard::withTrashed()->findOrFail($id);
        $restored = $this->service->restore($card);

        return response()->json(['data' => new AdminHomeCardResource($restored)]);
    }

    /** PUT /api/admin/v1/home-cards/reorder */
    public function reorder(ReorderHomeCardsRequest $request): JsonResponse
    {
        $this->service->reorder($request->input('order'));

        return response()->json(['message' => 'Cards reordered successfully.']);
    }
}
