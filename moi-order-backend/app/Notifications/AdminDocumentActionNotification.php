<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Channels\ExpoPushChannel;
use App\DTOs\ExpoPushMessage;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — owns the admin-document-action notification payload.
 * Sent to user when an admin creates or deletes one of their documents.
 */
class AdminDocumentActionNotification extends Notification
{
    public function __construct(
        private readonly string $action,   // 'added' | 'removed'
        private readonly string $typeLabel,
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
            data:  ['notification_type' => 'document_action'],
        );
    }

    private function payload(): array
    {
        return match ($this->action) {
            'added' => [
                'title' => 'Document Added',
                'body'  => "An admin has added a {$this->typeLabel} document to your profile.",
                'type'  => 'document_added',
            ],
            default => [
                'title' => 'Document Removed',
                'body'  => "An admin has removed a {$this->typeLabel} document from your profile.",
                'type'  => 'document_removed',
            ],
        ];
    }
}
