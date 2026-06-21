<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\PushNotificationInterface;
use App\DTOs\ExpoPushMessage;
use App\Events\CashOutConfirmed;
use App\Events\MerchantNotificationReceived;
use App\Models\DeviceToken;
use App\Models\MerchantNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to CashOutConfirmed: persist DB notification +
 *   re-broadcast real-time signal + Expo push to merchant devices.
 * Principle: DIP — depends on PushNotificationInterface, not Expo SDK directly.
 *
 * LISTENER REGISTRATION: auto-discovered via typed handle(). Do NOT also add
 * Event::listen() in AppServiceProvider — that would fire this listener twice.
 */
class NotifyMerchantOfCashOut implements ShouldQueue
{
    public function __construct(private readonly PushNotificationInterface $push) {}

    public function handle(CashOutConfirmed $event): void
    {
        $invoice = $event->invoice;
        $invoice->loadMissing('restaurant');
        $merchantId = $invoice->restaurant?->user_id;

        if ($merchantId === null) {
            Log::warning('NotifyMerchantOfCashOut: could not resolve merchant', [
                'invoice_id' => $invoice->id,
            ]);
            return;
        }

        $dateLabel = $invoice->date->format('M j, Y');
        $payout    = number_format($invoice->payout_cents / 100, 0);

        $notification = MerchantNotification::create([
            'merchant_id' => $merchantId,
            'type'        => 'cashout_confirmed',
            'title'       => 'Cashout Confirmed',
            'body'        => "Your {$dateLabel} payout of K {$payout} has been sent.",
            'order_id'    => null,
        ]);

        event(new MerchantNotificationReceived($notification));

        $tokens = DeviceToken::forUser($merchantId)
            ->where('platform', 'merchant')
            ->pluck('token')
            ->toArray();

        if (empty($tokens)) {
            return;
        }

        $this->push->send($tokens, new ExpoPushMessage(
            title: 'Cashout Confirmed',
            body:  "Your {$dateLabel} payout of K {$payout} has been sent.",
            data:  ['type' => 'cashout_confirmed', 'invoice_id' => $invoice->id],
        ));
    }
}
