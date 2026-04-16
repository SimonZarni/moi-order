<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes the admin-facing user HTTP response only.
 * Principle: Security — password and remember_token never present. Explicit toArray().
 *   Includes is_admin because admins need to see role status in management screens.
 */
class AdminUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'email'             => $this->email,
            'is_admin'          => $this->is_admin,
            'date_of_birth'     => $this->date_of_birth?->format('Y-m-d'),
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'created_at'        => $this->created_at->toISOString(),
            'deleted_at'        => $this->deleted_at?->toISOString(),
        ];
    }
}
