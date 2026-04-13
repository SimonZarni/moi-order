<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\ServiceSubmission;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Security: every query scoped to the authenticated user (forUser).
 */
class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $service,
    ) {}

    /**
     * POST /api/v1/submissions/{id}/payment
     * Create (or return existing pending) PromptPay QR for this submission.
     * Idempotent: calling twice returns the same pending payment.
     */
    public function store(int $id, Request $request): JsonResponse
    {
        $submission = ServiceSubmission::with('payment')
            ->forUser($request->user()->id)
            ->whereIn('status', [SubmissionStatus::PendingPayment, SubmissionStatus::PaymentFailed])
            ->findOrFail($id);

        $alreadyExists = $submission->payment !== null
            && $submission->payment->status->value === 'pending';

        $payment = $this->service->createForSubmission($submission);

        return response()->json(
            ['data' => new PaymentResource($payment)],
            $alreadyExists ? 200 : 201,
        );
    }

    /**
     * GET /api/v1/submissions/{id}/payment
     * Return the latest payment record for a submission.
     */
    public function show(int $id, Request $request): JsonResponse
    {
        $submission = ServiceSubmission::with('payment')
            ->forUser($request->user()->id)
            ->findOrFail($id);

        abort_if($submission->payment === null, 404, 'No payment found for this submission.');

        return response()->json(['data' => new PaymentResource($submission->payment)]);
    }
}
