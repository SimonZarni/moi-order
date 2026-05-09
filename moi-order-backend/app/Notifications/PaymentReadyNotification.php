<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Channels\ExpoPushChannel;
use App\DTOs\ExpoPushMessage;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — notifies a customer that admin has authorised their order for payment.
 * Sent via database (in-app bell) + ExpoPushChannel (OS banner).
 * Locale is read from notifiable->locale (stored when user changes language in-app).
 */
class PaymentReadyNotification extends Notification
{
    private const TITLES = [
        'en' => 'Order Confirmed',
        'mm' => 'အော်ဒါ အတည်ပြုပြီး',
        'th' => 'ยืนยันคำสั่งซื้อแล้ว',
    ];

    private const BODIES = [
        'en' => 'Order confirmed. Please proceed with payment to start processing.',
        'mm' => 'အော်ဒါ အတည်ပြုပြီးပါပြီ။ ဆောင်ရွက်ရန် ငွေပေးချေပါ။',
        'th' => 'ยืนยันคำสั่งซื้อแล้ว กรุณาชำระเงินเพื่อเริ่มดำเนินการ',
    ];

    public function __construct(
        private readonly string $orderType,  // 'ticket_order' | 'submission'
        private readonly int    $orderId,
        private readonly string $orderName,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', ExpoPushChannel::class];
    }

    public function toArray(object $notifiable): array
    {
        $locale = $this->locale($notifiable);
        return [
            'notification_type' => 'payment_ready',
            'order_type'        => $this->orderType,
            'order_id'          => $this->orderId,
            'title'             => self::TITLES[$locale],
            'body'              => self::BODIES[$locale],
        ];
    }

    public function toExpoPush(object $notifiable): ExpoPushMessage
    {
        $locale = $this->locale($notifiable);
        return new ExpoPushMessage(
            title: self::TITLES[$locale] . ' ✅',
            body:  self::BODIES[$locale],
            data:  [
                'notification_type' => 'payment_ready',
                'order_type'        => $this->orderType,
                'order_id'          => $this->orderId,
            ],
        );
    }

    private function locale(object $notifiable): string
    {
        $loc = $notifiable->locale ?? 'mm';
        return in_array($loc, ['en', 'mm', 'th'], true) ? $loc : 'mm';
    }
}
