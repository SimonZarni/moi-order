<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Principle: SRP — owns KYC application state machine labels and terminal check.
 */
enum KycApplicationStatus: string
{
    case Draft       = 'draft';
    case Submitted   = 'submitted';
    case UnderReview = 'under_review';
    case Approved    = 'approved';
    case Rejected    = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Draft       => 'Draft',
            self::Submitted   => 'Submitted',
            self::UnderReview => 'Under Review',
            self::Approved    => 'Approved',
            self::Rejected    => 'Rejected',
        };
    }

    /** Terminal statuses cannot transition further. */
    public function isTerminal(): bool
    {
        return in_array($this, [self::Approved, self::Rejected], strict: true);
    }

    /** Returns all non-terminal statuses awaiting admin action. */
    public static function pendingStatuses(): array
    {
        return [self::Submitted, self::UnderReview];
    }
}
