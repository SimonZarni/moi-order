<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Channels\ExpoPushChannel;
use App\DTOs\ExpoPushMessage;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — owns the custom announcement payload exclusively.
 * Principle: OCP — title/body are runtime values; no class change needed for new content.
 *
 * Channels:
 *   database       — persisted row, read by NotificationsScreen.
 *   ExpoPushChannel — OS-level push banner via Expo Push API.
 * Pusher broadcast handled separately by UserNotificationReceived in CustomNotificationService.
 */
class CustomAnnouncementNotification extends Notification
{
    public function __construct(
        private readonly string $title,
        private readonly string $body,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', ExpoPushChannel::class];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'notification_type' => 'custom_announcement',
            'title'             => $this->title,
            'body'              => $this->body,
        ];
    }

    public function toExpoPush(object $notifiable): ExpoPushMessage
    {
        return new ExpoPushMessage(
            title: $this->title,
            body:  $this->body,
            data:  ['notification_type' => 'custom_announcement'],
        );
    }
}
