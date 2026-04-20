<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\ChangePasswordDTO;
use App\DTOs\UpdateProfileDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\DeleteAccountRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — auth enforced by middleware (auth:sanctum in api.php); never inside here.
 */
class ProfileController extends Controller
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    /** PUT /api/v1/profile */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->profileService->updateProfile(
            $request->user(),
            UpdateProfileDTO::fromRequest($request),
        );

        return response()->json(['data' => new UserResource($user)]);
    }

    /** PUT /api/v1/profile/password */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->profileService->changePassword(
            $request->user(),
            ChangePasswordDTO::fromRequest($request),
        );

        return response()->json(null, 204);
    }

    /** DELETE /api/v1/profile */
    public function destroy(DeleteAccountRequest $request): JsonResponse
    {
        $this->profileService->deleteAccount($request->user());

        return response()->json(null, 204);
    }
}
