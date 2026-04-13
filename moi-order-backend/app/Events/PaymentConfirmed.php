<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\ServiceSubmission;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — records one fact: a submission's payment was confirmed by Stripe.
 * Fired inside DB::transaction in StripeWebhookController to guarantee atomicity.
 */
class PaymentConfirmed
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly ServiceSubmission $submission,
    ) {}
}
