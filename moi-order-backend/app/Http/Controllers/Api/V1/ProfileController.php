<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\ChangePasswordDTO;
use App\DTOs\AppleAuthDTO;
use App\DTOs\GoogleAuthDTO;
use App\DTOs\LineAuthDTO;
use App\DTOs\UpdateProfileDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\DeleteAccountRequest;
use App\Http\Requests\UpdateSimulatedDateRequest;
use App\Http\Requests\LinkAppleRequest;
use App\Http\Requests\LinkGoogleRequest;
use App\Http\Requests\LinkLineRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UploadProfilePictureRequest;
use App\Http\Resources\UserResource;
use App\Services\AppleAuthService;
use App\Services\GoogleAuthService;
use App\Services\LineAuthService;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — auth enforced by middleware (auth:sanctum in api.php); never inside here.
 */
class ProfileController extends Controller
{
    public function __construct(
        private readonly ProfileService $profileService,
        private readonly GoogleAuthService $googleAuthService,
        private readonly AppleAuthService $appleAuthService,
        private readonly LineAuthService $lineAuthService,
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

    /** POST /api/v1/profile/link/google */
    public function linkGoogle(LinkGoogleRequest $request): JsonResponse
    {
        $user = $this->googleAuthService->linkAccount(
            $request->user(),
            GoogleAuthDTO::fromRequest($request),
        );

        return response()->json(['data' => new UserResource($user)]);
    }

    /** POST /api/v1/profile/link/apple */
    public function linkApple(LinkAppleRequest $request): JsonResponse
    {
        $user = $this->appleAuthService->linkAccount(
            $request->user(),
            AppleAuthDTO::fromRequest($request),
        );

        return response()->json(['data' => new UserResource($user)]);
    }

    /** POST /api/v1/profile/link/line */
    public function linkLine(LinkLineRequest $request): JsonResponse
    {
        $user = $this->lineAuthService->linkAccount(
            $request->user(),
            LineAuthDTO::fromRequest($request),
        );

        return response()->json(['data' => new UserResource($user)]);
    }

    /** POST /api/v1/profile/picture */
    public function uploadPicture(UploadProfilePictureRequest $request): JsonResponse
    {
        $user = $this->profileService->uploadProfilePicture(
            $request->user(),
            $request->file('picture'),
        );

        return response()->json(['data' => new UserResource($user)]);
    }

    /** DELETE /api/v1/profile/picture */
    public function removePicture(Request $request): JsonResponse
    {
        $user = $this->profileService->removeProfilePicture($request->user());

        return response()->json(['data' => new UserResource($user)]);
    }

    /** DELETE /api/v1/profile/link/google */
    public function unlinkGoogle(Request $request): JsonResponse
    {
        $user = $this->profileService->unlinkProvider($request->user(), 'google');

        return response()->json(['data' => new UserResource($user)]);
    }

    /** DELETE /api/v1/profile/link/apple */
    public function unlinkApple(Request $request): JsonResponse
    {
        $user = $this->profileService->unlinkProvider($request->user(), 'apple');

        return response()->json(['data' => new UserResource($user)]);
    }

    /** PATCH /api/v1/profile/simulated-date — privileged accounts only */
    public function updateSimulatedDate(UpdateSimulatedDateRequest $request): JsonResponse
    {
        $user = $this->profileService->updateSimulatedDate(
            $request->user(),
            $request->input('date'),
        );

        return response()->json(['data' => new UserResource($user)]);
    }

    /** DELETE /api/v1/profile/link/line */
    public function unlinkLine(Request $request): JsonResponse
    {
        $user = $this->profileService->unlinkProvider($request->user(), 'line');

        return response()->json(['data' => new UserResource($user)]);
    }
}
