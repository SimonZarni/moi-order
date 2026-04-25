<?php

declare(strict_types=1);

namespace App\DTOs;

/**
 * Principle: SRP — immutable push payload; no business logic.
 * Data array should contain only navigation IDs — never PII or amounts.
 */
readonly class ExpoPushMessage
{
    /**
     * @param array<string, mixed> $data  Navigation payload (notification_type + entity ID only)
     */
    public function __construct(
        public string $title,
        public string $body,
        public array  $data = [],
    ) {}
}
