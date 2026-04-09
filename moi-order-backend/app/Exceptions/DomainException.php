<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * Represents a business rule violation.
 * Thrown from Service layer; mapped to HTTP 409 (or custom status) in bootstrap/app.php.
 * Principle: SRP — carries domain error code + HTTP status; nothing else.
 */
final class DomainException extends RuntimeException
{
    public function __construct(string $code, private readonly int $status = 409)
    {
        parent::__construct($code);
    }

    public function getStatus(): int
    {
        return $this->status;
    }
}
