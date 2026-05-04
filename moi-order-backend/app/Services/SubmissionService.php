<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ServiceSubmission;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — user-triggered submission lifecycle only (cancel, delete).
 *   Creation is handled by DynamicSubmissionService; admin actions by AdminSubmissionService.
 */
class SubmissionService
{
    public function cancelByCustomer(ServiceSubmission $submission): ServiceSubmission
    {
        DB::transaction(function () use ($submission): void {
            $submission->cancel();
        });

        return $submission->fresh(['serviceType.service']);
    }

    public function deleteCancelled(ServiceSubmission $submission): void
    {
        $submission->delete();
    }
}
