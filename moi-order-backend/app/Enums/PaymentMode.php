<?php

declare(strict_types=1);

namespace App\Enums;

enum PaymentMode: string
{
    case Stripe   = 'stripe';
    case GlobalQr = 'global_qr';
    case ManualQr = 'manual_qr';

    public function label(): string
    {
        return match($this) {
            self::Stripe   => 'Stripe PromptPay',
            self::GlobalQr => 'Global QR Image',
            self::ManualQr => 'Per-Submission QR',
        };
    }

    public function isStripe(): bool
    {
        return $this === self::Stripe;
    }

    public function isQrBased(): bool
    {
        return $this !== self::Stripe;
    }
}
