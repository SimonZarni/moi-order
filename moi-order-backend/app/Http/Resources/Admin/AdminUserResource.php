<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Contracts\FileStorageInterface;
use App\Enums\SubmissionStatus;
use App\Enums\TicketOrderStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes the admin-facing user list/summary HTTP response.
 * Security: password, remember_token, OAuth IDs never present. Explicit toArray().
 */
class AdminUserResource extends JsonResource
{
    private function computeIsMoiVerified(): bool
    {
        $channels = collect([
            $this->google_id,
            $this->apple_id,
            $this->line_id,
            $this->phone_number,
        ])->filter()->count();

        if ($channels < 2) {
            return false;
        }

        $payments = $this->resource->serviceSubmissions()
            ->whereIn('status', [SubmissionStatus::Processing->value, SubmissionStatus::Completed->value])
            ->count();

        $payments += $this->resource->ticketOrders()
            ->whereIn('status', [TicketOrderStatus::Processing->value, TicketOrderStatus::Completed->value])
            ->count();

        return $payments >= 3;
    }

    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->uuid,
            'name'              => $this->name,
            'email'             => $this->email,
            'phone_number'      => $this->phone_number,
            'profile_picture_url' => $this->profile_picture_path
                ? resolve(FileStorageInterface::class)->publicUrl($this->profile_picture_path)
                : null,
            'is_admin'          => $this->is_admin,
            'is_merchant'       => $this->is_merchant,
            'is_privileged'     => $this->resource->isPrivileged(),
            'user_role'         => $this->user_role->value,
            'is_moi_verified'   => $this->computeIsMoiVerified(),
            'is_online'         => $this->isOnline(),
            'last_active_at'    => $this->last_active_at?->toISOString(),
            'status'            => $this->status->value,
            'suspended_until'   => $this->suspended_until?->toISOString(),
            'date_of_birth'     => $this->date_of_birth?->format('Y-m-d'),
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'created_at'        => $this->created_at->toISOString(),
            'deleted_at'        => $this->deleted_at?->toISOString(),
            'connected_channels' => [
                'email'  => ['connected' => $this->email !== null, 'value' => $this->email],
                'phone'  => ['connected' => $this->phone_number !== null, 'value' => $this->phone_number],
                'google' => ['connected' => $this->google_id !== null],
                'apple'  => ['connected' => $this->apple_id !== null],
                'line'   => ['connected' => $this->line_id !== null, 'value' => $this->line_handle],
            ],
            'role'              => $this->adminRole ? [
                'id'              => $this->adminRole->id,
                'slug'            => $this->adminRole->slug,
                'label'           => $this->adminRole->label,
                'permission_keys' => $this->adminRole->permissions->pluck('key')->all(),
            ] : null,
        ];
    }
}
