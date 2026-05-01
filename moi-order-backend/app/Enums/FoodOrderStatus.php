<?php

declare(strict_types=1);

namespace App\Enums;

enum FoodOrderStatus: string
{
    case OrderPlaced          = 'order_placed';
    case WaitingForPayment    = 'waiting_for_payment';
    case PaymentConfirmed     = 'payment_confirmed';
    case PreparingFood        = 'preparing_food';
    case WaitingForDelivery   = 'waiting_for_delivery';
    case DeliveryOnTheWay     = 'delivery_on_the_way';
    case Delivered            = 'delivered';
    case Completed            = 'completed';
    case Cancelled            = 'cancelled';

    public function label(): string
    {
        return match($this) {
            self::OrderPlaced        => 'Order Placed',
            self::WaitingForPayment  => 'Waiting for Payment',
            self::PaymentConfirmed   => 'Payment Confirmed',
            self::PreparingFood      => 'Preparing Food',
            self::WaitingForDelivery => 'Waiting for Delivery',
            self::DeliveryOnTheWay   => 'Delivery on the Way',
            self::Delivered          => 'Delivered',
            self::Completed          => 'Completed',
            self::Cancelled          => 'Cancelled',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Completed, self::Cancelled], true);
    }

    public function phase(): int
    {
        return match($this) {
            self::OrderPlaced, self::WaitingForPayment,
            self::PaymentConfirmed                      => 1,
            default                                     => 2,
        };
    }

    /** @return list<self> */
    public function allowedTransitions(): array
    {
        return match($this) {
            self::OrderPlaced        => [self::WaitingForPayment,  self::Cancelled],
            self::WaitingForPayment  => [self::PaymentConfirmed,   self::Cancelled],
            self::PaymentConfirmed   => [self::PreparingFood,      self::Cancelled],
            self::PreparingFood      => [self::WaitingForDelivery, self::Cancelled],
            self::WaitingForDelivery => [self::DeliveryOnTheWay,   self::Cancelled],
            self::DeliveryOnTheWay   => [self::Delivered,          self::Cancelled],
            self::Delivered          => [self::Completed],
            self::Completed,
            self::Cancelled          => [],
        };
    }

    public function canTransitionTo(self $next): bool
    {
        return in_array($next, $this->allowedTransitions(), true);
    }
}
