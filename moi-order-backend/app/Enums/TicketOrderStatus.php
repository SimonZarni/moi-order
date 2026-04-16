<?php

declare(strict_types=1);

namespace App\Enums;

enum TicketOrderStatus: string
{
    case PendingPayment = 'pending_payment';
    case Processing     = 'processing';
    case Completed      = 'completed';
    case PaymentFailed  = 'payment_failed';

    public function label(): string
    {
        return match($this) {
            self::PendingPayment => 'Pending Payment',
            self::Processing     => 'Processing',
            self::Completed      => 'Completed',
            self::PaymentFailed  => 'Payment Failed',
        };
    }

    public function isTerminal(): bool
    {
        return match($this) {
            self::PendingPayment => false,
            self::Processing     => false,
            self::Completed      => true,
            self::PaymentFailed  => false,
        };
    }
}
