<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Api\CompleteFoodOrderRequest;

readonly class CompleteFoodOrderDTO
{
    public function __construct(
        public readonly ?int    $rating,
        public readonly ?string $review,
    ) {}

    public static function fromRequest(CompleteFoodOrderRequest $request): self
    {
        return new self(
            rating: $request->integer('rating') ?: null,
            review: $request->string('review')->toString() ?: null,
        );
    }
}
