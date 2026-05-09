<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Enums\KycApplicationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReviewKycRequest;
use App\Http\Resources\Merchant\KycApplicationResource;
use App\Models\KycApplication;
use App\Services\KycService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — admin.auth middleware asserts is_admin before any action.
 */
class AdminKycController extends Controller
{
    public function __construct(
        private readonly KycService $kycService,
    ) {}

    /** GET /api/admin/v1/kyc-applications?status=&type=&search=&page= */
    public function index(Request $request): JsonResponse
    {
        $query = KycApplication::with(['applicant.restaurant', 'documents'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('type'), fn ($q, $type) => $q->where('type', $type))
            ->when($request->query('search'), function ($q, $search): void {
                $q->where(function ($inner) use ($search): void {
                    $inner->where('business_name', 'like', "%{$search}%")
                          ->orWhereHas('applicant', fn ($u) => $u->where('name', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->latest('submitted_at');

        $paginated = $query->paginate(20);

        return response()->json([
            'data' => KycApplicationResource::collection($paginated),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
        ]);
    }

    /** GET /api/admin/v1/kyc-applications/{application} */
    public function show(KycApplication $application): JsonResponse
    {
        $application->load(['applicant', 'documents', 'reviewer']);

        return response()->json(['data' => new KycApplicationResource($application)]);
    }

    /** POST /api/admin/v1/kyc-applications/{application}/review */
    public function review(ReviewKycRequest $request, KycApplication $application): JsonResponse
    {
        $action = $request->validated('action');
        $notes  = $request->validated('notes');

        $app = $action === 'approve'
            ? $this->kycService->approve($application, $request->user(), $notes)
            : $this->kycService->reject($application, $request->user(), (string) $notes);

        $app->load(['applicant', 'documents', 'reviewer']);

        return response()->json(['data' => new KycApplicationResource($app)]);
    }

    /** GET /api/admin/v1/merchants/kyc-badge */
    public function pendingCount(): JsonResponse
    {
        $count = KycApplication::whereIn('status', [
            KycApplicationStatus::Submitted->value,
            KycApplicationStatus::UnderReview->value,
        ])->count();

        return response()->json(['data' => ['count' => $count]]);
    }
}
