<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminPaymentIndexRequest;
use App\Http\Resources\Admin\AdminPaymentResource;
use App\Models\Payment;
use App\Services\AdminPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. Read-only; no mutation actions.
 */
class AdminPaymentController extends Controller
{
    public function __construct(private readonly AdminPaymentService $service) {}

    /** GET /api/admin/v1/payments */
    public function index(AdminPaymentIndexRequest $request): AnonymousResourceCollection
    {
        return AdminPaymentResource::collection($this->service->index($request));
    }

    /** GET /api/admin/v1/payments/stats */
    public function stats(): JsonResponse
    {
        return response()->json(['data' => $this->service->stats()]);
    }

    /** GET /api/admin/v1/payments/{payment} */
    public function show(Payment $payment): JsonResponse
    {
        return response()->json(['data' => new AdminPaymentResource($this->service->show($payment))]);
    }
}
