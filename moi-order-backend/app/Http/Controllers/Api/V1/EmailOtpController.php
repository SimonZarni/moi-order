<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\EmailOtpRequestDTO;
use App\DTOs\EmailOtpVerifyDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\EmailOtpRequestRequest;
use App\Http\Requests\EmailOtpVerifyRequest;
use App\Http\Resources\UserResource;
use App\Services\EmailOtpService;
use Illuminate\Http\JsonResponse;

class EmailOtpController extends Controller
{
    public function __construct(
        private readonly EmailOtpService $emailOtpService,
    ) {}

    /** POST /api/v1/auth/email-otp/request — intentionally public */
    public function requestOtp(EmailOtpRequestRequest $request): JsonResponse
    {
        return response()->json([
            'data' => $this->emailOtpService->requestOtp(EmailOtpRequestDTO::fromRequest($request)),
        ]);
    }

    /** POST /api/v1/auth/email-otp/verify — intentionally public */
    public function verifyOtp(EmailOtpVerifyRequest $request): JsonResponse
    {
        $result = $this->emailOtpService->verifyOtp(EmailOtpVerifyDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }
}
