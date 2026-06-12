<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\ChangePasswordRequest;
use App\Services\MerchantProfileService;
use Illuminate\Http\JsonResponse;

class MerchantProfileController extends Controller
{
    public function __construct(
        private readonly MerchantProfileService $profileService,
    ) {}

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->profileService->changePassword(
            $request->user(),
            $request->validated('new_password'),
        );

        return response()->json(null, 204);
    }
}
