<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\SubmissionStatus;
use App\Enums\TicketOrderStatus;
use App\Models\ServiceSubmission;
use App\Models\TicketOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class VerificationStatusController extends Controller
{
    private const CHANNELS_REQUIRED  = 2;
    private const PAYMENTS_REQUIRED  = 3;

    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $connectedChannels = collect([
            $user->google_id,
            $user->apple_id,
            $user->line_id,
            ($user->phone_number !== null && $user->phone_number !== '') ? '1' : null,
        ])->filter()->count();

        $successfulSubmissions = ServiceSubmission::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [SubmissionStatus::Processing->value, SubmissionStatus::Completed->value])
            ->count();

        $successfulTicketOrders = TicketOrder::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [TicketOrderStatus::Processing->value, TicketOrderStatus::Completed->value])
            ->count();

        $successfulPayments = $successfulSubmissions + $successfulTicketOrders;

        $isVerified = $connectedChannels >= self::CHANNELS_REQUIRED
            && $successfulPayments >= self::PAYMENTS_REQUIRED;

        return response()->json([
            'data' => [
                'connected_channels'  => $connectedChannels,
                'successful_payments' => $successfulPayments,
                'is_verified'         => $isVerified,
            ],
        ]);
    }
}
