<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Channels\ExpoPushChannel;
use App\DTOs\ExpoPushMessage;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — owns only the 90-day report reminder payload.
 * Principle: OCP — changing copy = update payload() only.
 *
 * Channels: database (notification centre) + ExpoPushChannel (push banner).
 */
class NinetyDayReportReminderNotification extends Notification
{
    public function __construct(
        private readonly int $daysRemaining,
    ) {}

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
        $payload = $this->payload();

        return new ExpoPushMessage(
            title: $payload['title'],
            body:  $payload['body'],
            data:  ['notification_type' => 'ninety_day_reminder'],
        );
    }

    private function payload(): array
    {
        return [
            'notification_type' => 'ninety_day_reminder',
            'title'             => $this->title(),
            'body'              => $this->body(),
            'days_remaining'    => $this->daysRemaining,
        ];
    }

    private function title(): string
    {
        if ($this->daysRemaining > 7) {
            return '90-Day Report Reminder';
        }
        if ($this->daysRemaining >= 0) {
            return $this->daysRemaining === 0
                ? '90-Day Report Due TODAY'
                : '90-Day Report Due Soon';
        }
        return '90-Day Report Overdue';
    }

    private function body(): string
    {
        $cta = 'Submit here at Moi Order app now.';

        return match(true) {
            $this->daysRemaining === 20 =>
                "Your 90-day report is due in 20 days. {$cta}",
            $this->daysRemaining === 10 =>
                "Your 90-day report is due in 10 days. {$cta}",
            $this->daysRemaining === 8 =>
                "Your 90-day report is due in 8 days. {$cta}",
            $this->daysRemaining > 0 =>
                "Your 90-day report is due in {$this->daysRemaining} day" . ($this->daysRemaining === 1 ? '' : 's') . ". {$cta}",
            $this->daysRemaining === 0 =>
                "Your 90-day report is due today. {$cta}",
            default => sprintf(
                'Your 90-day report is %d day%s overdue. %s',
                abs($this->daysRemaining),
                abs($this->daysRemaining) === 1 ? '' : 's',
                $cta,
            ),
        };
    }
}
