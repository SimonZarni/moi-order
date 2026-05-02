<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Channels\ExpoPushChannel;
use App\DTOs\ExpoPushMessage;
use App\Enums\FoodOrderStatus;
use App\Models\FoodOrder;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — food-order status notification payload only.
 * Channels: database (in-app bell) + ExpoPushChannel (OS banner).
 * OCP: new status copy = update statusCopy() only.
 */
class FoodOrderStatusNotification extends Notification
{
    public function __construct(private readonly FoodOrder $order) {}

    public function via(object $notifiable): array
    {
        return ['database', ExpoPushChannel::class];
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toExpoPush(object $notifiable): ExpoPushMessage
    {
        $p = $this->payload();

        return new ExpoPushMessage(
            title: $p['title'],
            body:  $p['body'],
            data:  [
                'notification_type' => 'food_order_status',
                'food_order_id'     => $this->order->id,
                'status'            => $this->order->status->value,
            ],
        );
    }

    private function payload(): array
    {
        [$title, $body] = $this->statusCopy($this->order->status);

        return [
            'notification_type' => 'food_order_status',
            'title'             => $title,
            'body'              => $body,
            'food_order_id'     => $this->order->id,
            'order_number'      => $this->order->order_number,
            'status'            => $this->order->status->value,
        ];
    }

    /** @return array{0: string, 1: string} */
    private function statusCopy(FoodOrderStatus $status): array
    {
        $num = $this->order->order_number ?? "#{$this->order->id}";

        return match($status) {
            FoodOrderStatus::WaitingForPayment  => [
                'Order Accepted — Please Pay',
                "Order {$num} accepted! Open LINE @moiorder to complete payment.",
            ],
            FoodOrderStatus::PaymentConfirmed   => [
                'Payment Confirmed',
                "Payment for order {$num} confirmed. We're preparing your food!",
            ],
            FoodOrderStatus::PreparingFood      => [
                'Preparing Your Food',
                "The restaurant is preparing order {$num}.",
            ],
            FoodOrderStatus::WaitingForDelivery => [
                'Ready for Pickup',
                "Order {$num} is ready and waiting for a rider.",
            ],
            FoodOrderStatus::DeliveryOnTheWay   => [
                'On the Way!',
                "Your order {$num} is on the way. Get ready!",
            ],
            FoodOrderStatus::Delivered          => [
                'Order Delivered',
                "Order {$num} has been delivered. Tap to confirm and rate your experience.",
            ],
            FoodOrderStatus::Completed          => [
                'Order Complete',
                "Order {$num} is complete. Thank you for ordering!",
            ],
            FoodOrderStatus::Cancelled          => [
                'Order Cancelled',
                "Order {$num} has been cancelled.",
            ],
            default => ['Order Update', "Order {$num} status: {$status->label()}."],
        };
    }
}
