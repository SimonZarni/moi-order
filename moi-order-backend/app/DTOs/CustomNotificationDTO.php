<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\CustomNotificationTargetType;
use App\Http\Requests\Api\Admin\V1\SendCustomNotificationRequest;

/**
 * Principle: SRP — immutable value object carrying the send parameters only.
 * Principle: DIP — Controller builds this from Request; Service receives plain typed data.
 */
readonly class CustomNotificationDTO
{
    public function __construct(
        public string                       $title,
        public string                       $body,
        public CustomNotificationTargetType $targetType,
        public ?string                      $userEmail,
    ) {}

    public static function fromRequest(SendCustomNotificationRequest $request): self
    {
        return new self(
            title:      $request->validated('title'),
            body:       $request->validated('body'),
            targetType: CustomNotificationTargetType::from($request->validated('target_type')),
            userEmail:  $request->validated('user_email'),
        );
    }
}
