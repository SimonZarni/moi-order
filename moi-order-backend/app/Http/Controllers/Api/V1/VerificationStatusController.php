<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\DocumentType;
use App\Enums\SubmissionStatus;
use App\Models\Document;
use App\Models\ServiceSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class VerificationStatusController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $connectedChannel = $user->google_id !== null
            || $user->apple_id !== null
            || $user->line_id !== null
            || ($user->phone_number !== null && $user->phone_number !== '');

        $passportUploaded = Document::query()
            ->forUser($user->id)
            ->ofType(DocumentType::Passport)
            ->exists();

        $ninetyDayUploaded = Document::query()
            ->forUser($user->id)
            ->ofType(DocumentType::NinetyDayReport)
            ->exists();

        $myDocsUploaded = Document::query()
            ->forUser($user->id)
            ->ofType(DocumentType::Other)
            ->exists();

        $successfulPayment = ServiceSubmission::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [SubmissionStatus::Processing->value, SubmissionStatus::Completed->value])
            ->exists();

        $isVerified = $connectedChannel
            && $passportUploaded
            && $ninetyDayUploaded
            && $myDocsUploaded
            && $successfulPayment;

        return response()->json([
            'data' => [
                'connected_channel'   => $connectedChannel,
                'passport_uploaded'   => $passportUploaded,
                'ninety_day_uploaded' => $ninetyDayUploaded,
                'my_docs_uploaded'    => $myDocsUploaded,
                'successful_payment'  => $successfulPayment,
                'is_verified'         => $isVerified,
            ],
        ]);
    }
}
