<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\CreateAdminAccountDTO;
use App\Exceptions\DomainException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SendAdminOtpRequest;
use App\Http\Requests\Admin\StoreAdminRequest;
use App\Http\Requests\Admin\UpdateAdminRequest;
use App\Http\Requests\Admin\VerifyAdminOtpRequest;
use App\Http\Resources\Admin\AdminAccountResource;
use App\Models\User;
use App\Services\AdminAccountService;
use Illuminate\Http\JsonResponse;

class AdminAccountController extends Controller
{
    public function __construct(private readonly AdminAccountService $service) {}

    public function index(): JsonResponse
    {
        $admins = User::where('is_admin', true)
            ->with('adminRole')
            ->latest()
            ->paginate(20);

        return AdminAccountResource::collection($admins)->response();
    }

    public function sendOtp(SendAdminOtpRequest $request): JsonResponse
    {
        $result = $this->service->sendOtp($request->string('email')->lower()->toString());

        return response()->json(['message' => 'OTP sent.', ...$result]);
    }

    public function verifyOtp(VerifyAdminOtpRequest $request): JsonResponse
    {
        $verifiedToken = $this->service->verifyOtp(
            $request->string('email')->lower()->toString(),
            $request->string('otp')->toString(),
        );

        return response()->json(['verified_token' => $verifiedToken]);
    }

    public function store(StoreAdminRequest $request): JsonResponse
    {
        $admin = $this->service->create(CreateAdminAccountDTO::fromRequest($request));

        return (new AdminAccountResource($admin->load('adminRole')))->response()->setStatusCode(201);
    }

    public function update(UpdateAdminRequest $request, int $id): JsonResponse
    {
        $user = User::where('is_admin', true)->findOrFail($id);

        $this->service->update($user, $request->validated());

        return (new AdminAccountResource($user->fresh('adminRole')))->response();
    }

    public function toggle(int $id): JsonResponse
    {
        $user = User::where('is_admin', true)->findOrFail($id);

        if ($user->isSuperAdmin()) {
            throw new DomainException('admins.cannot_deactivate_super_admin', 403);
        }

        $this->service->toggle($user);

        return (new AdminAccountResource($user->fresh('adminRole')))->response();
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::where('is_admin', true)->findOrFail($id);

        if ($user->isSuperAdmin()) {
            throw new DomainException('admins.cannot_delete_super_admin', 403);
        }

        $this->service->delete($user);

        return response()->json(null, 204);
    }
}
