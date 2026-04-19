<?php

declare(strict_types=1);

namespace App\Enums;

enum SubmissionStatus: string
{
    case PendingPayment = 'pending_payment';
    case Processing     = 'processing';
    case Completed      = 'completed';
    case PaymentFailed  = 'payment_failed';
    case Cancelled      = 'cancelled';

    public function label(): string
    {
        return match($this) {
            self::PendingPayment => 'Pending Payment',
            self::Processing     => 'Processing',
            self::Completed      => 'Completed',
            self::PaymentFailed  => 'Payment Failed',
            self::Cancelled      => 'Cancelled',
        };
    }

    public function isTerminal(): bool
    {
        return match($this) {
            self::PendingPayment => false,
            self::Processing     => false,
            self::Completed      => true,
            self::PaymentFailed  => false,
            self::Cancelled      => true,
        };
    }
}
