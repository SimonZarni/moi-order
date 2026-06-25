<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: Security — password, remember_token and sensitive fields never present.
 * SRP — shapes the user HTTP response only.
 */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->uuid,
            'name'                => $this->name,
            'email'               => $this->email,
            'phone_number'        => $this->phone_number,
            'profile_picture_url' => $this->profile_picture_path
                ? resolve(FileStorageInterface::class)->publicUrl($this->profile_picture_path)
                : null,
            'has_password'        => $this->password !== null,
            'has_google'        => $this->google_id !== null,
            'has_apple'         => $this->apple_id !== null,
            'has_line'          => $this->line_id !== null,
            'line_handle'       => $this->line_handle,
            'date_of_birth'     => $this->date_of_birth?->format('Y-m-d'),
            'role'              => $this->user_role?->value ?? 'regular',
            'is_privileged'     => $this->isPrivileged(),
            'is_merchant'       => $this->is_merchant,
            'simulated_date'    => $this->isPrivileged() ? $this->simulated_date?->format('Y-m-d') : null,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'phone_verified_at' => $this->phone_verified_at?->toISOString(),
            'created_at'        => $this->created_at->toISOString(),
        ];
    }
}
