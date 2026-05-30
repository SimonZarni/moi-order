<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Tracks how confident we are that a Place row is correctly linked to a Google Place ID.
 * Principle: SRP — enum owns its own label + terminal-state semantics.
 */
enum GoogleMatchStatus: string
{
    /** Set automatically by the Artisan match command (first result within 500 m). */
    case AutoMatched = 'auto_matched';

    /** The Artisan command found no Google match — needs a human to set the ID manually. */
    case NeedsManual = 'needs_manual';

    /** An admin has explicitly confirmed/saved the Google Place ID. */
    case Verified = 'verified';

    public function label(): string
    {
        return match ($this) {
            self::AutoMatched => 'Auto Matched',
            self::NeedsManual => 'Not Found',
            self::Verified    => 'Verified',
        };
    }

    /** Returns true only for statuses where we trust the Google Place ID enough to fetch photos. */
    public function isTrusted(): bool
    {
        return $this === self::AutoMatched || $this === self::Verified;
    }
}
