<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int         $id
 * @property string      $email
 * @property string      $otp
 * @property string      $purpose
 * @property int         $attempts
 * @property Carbon      $expires_at
 * @property Carbon|null $verified_at
 * @property string|null $verified_token
 * @property Carbon|null $verified_token_expires_at
 * @property Carbon      $created_at
 * @property Carbon      $updated_at
 */
class EmailOtp extends Model
{
    protected $fillable = [
        'email',
        'otp',
        'purpose',
        'attempts',
        'expires_at',
        'verified_at',
        'verified_token',
        'verified_token_expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at'                => 'datetime',
            'verified_at'               => 'datetime',
            'verified_token_expires_at' => 'datetime',
            'attempts'                  => 'integer',
        ];
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }

    public function hasExceededAttempts(): bool
    {
        return $this->attempts >= 5;
    }

    public function isVerifiedTokenExpired(): bool
    {
        return $this->verified_token_expires_at === null
            || $this->verified_token_expires_at->isPast();
    }
}
