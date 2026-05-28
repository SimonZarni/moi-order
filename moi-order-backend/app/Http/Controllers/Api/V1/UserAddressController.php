<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreUserAddressRequest;
use App\Http\Requests\Api\V1\UpdateUserAddressRequest;
use App\Http\Resources\UserAddressResource;
use App\Models\UserAddress;
use App\Services\UserAddressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserAddressController extends Controller
{
    public function __construct(private readonly UserAddressService $addressService) {}

    public function index(Request $request): JsonResponse
    {
        $addresses = $this->addressService->listForUser($request->user()->id);

        return response()->json(['data' => UserAddressResource::collection($addresses)]);
    }

    public function store(StoreUserAddressRequest $request): JsonResponse
    {
        $address = $this->addressService->create($request->user()->id, $request->validated());

        return response()->json(['data' => new UserAddressResource($address)], 201);
    }

    public function update(UpdateUserAddressRequest $request, int $id): JsonResponse
    {
        $address = UserAddress::forUser($request->user()->id)->findOrFail($id);
        $address = $this->addressService->update($address, $request->validated());

        return response()->json(['data' => new UserAddressResource($address)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $address = UserAddress::forUser($request->user()->id)->findOrFail($id);
        $this->addressService->delete($address);

        return response()->json(null, 204);
    }

    public function setDefault(Request $request, int $id): JsonResponse
    {
        $address = UserAddress::forUser($request->user()->id)->findOrFail($id);
        $address = $this->addressService->setDefault($address);

        return response()->json(['data' => new UserAddressResource($address)]);
    }
}
