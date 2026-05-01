<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\KycApplication;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — one fact: a KYC application was approved.
 */
class KycApplicationApproved
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly KycApplication $application,
    ) {}
}
