<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\CashOutConfirmed;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to CashOutConfirmed: delivers a Web Push to the merchant's
 *   browser confirming their payout was processed.
 * Principle: DIP — depends on WebPushInterface, not WebPushService directly.
 * ShouldQueue + $afterCommit: fires after the cashout transaction commits.
 *
 * LISTENER REGISTRATION: auto-discovered via typed handle(). Do NOT also add
 * Event::listen() in AppServiceProvider — that would fire this listener twice.
 */
class SendWebPushToMerchantOnCashOut implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(CashOutConfirmed $event): void
    {
        $invoice = $event->invoice;
        $invoice->loadMissing('restaurant');
        $merchantId = $invoice->restaurant?->user_id;

        if ($merchantId === null) {
            Log::warning('SendWebPushToMerchantOnCashOut: could not resolve merchant', [
                'invoice_id' => $invoice->id,
            ]);
            return;
        }

        $merchant = User::find($merchantId);

        if ($merchant === null) {
            return;
        }

        $dateLabel = $invoice->date->format('M j, Y');
        $payout    = number_format($invoice->payout_cents / 100, 0);

        $this->webPush->sendToUser(
            $merchant,
            'Cashout Confirmed',
            "Your {$dateLabel} payout of K {$payout} has been sent.",
            ['type' => 'cashout_confirmed', 'invoice_id' => $invoice->id],
        );
    }
}
