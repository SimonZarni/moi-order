<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * Principle: SRP — full admin user detail response including orders and documents.
 * Only used on the detail page (show endpoint), not the list.
 */
class AdminUserDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'name'               => $this->name,
            'email'              => $this->email,
            'phone_number'       => $this->phone_number,
            'profile_picture_url' => $this->profile_picture_path
                ? Storage::url($this->profile_picture_path)
                : null,
            'is_admin'           => $this->is_admin,
            'is_merchant'        => $this->is_merchant,
            'is_online'          => $this->isOnline(),
            'last_active_at'     => $this->last_active_at?->toISOString(),
            'status'             => $this->status->value,
            'suspended_until'    => $this->suspended_until?->toISOString(),
            'date_of_birth'      => $this->date_of_birth?->format('Y-m-d'),
            'email_verified_at'  => $this->email_verified_at?->toISOString(),
            'created_at'         => $this->created_at->toISOString(),
            'deleted_at'         => $this->deleted_at?->toISOString(),
            'connected_channels' => [
                'email'  => ['connected' => $this->email !== null,        'value' => $this->email],
                'phone'  => ['connected' => $this->phone_number !== null, 'value' => $this->phone_number],
                'google' => ['connected' => $this->google_id !== null],
                'apple'  => ['connected' => $this->apple_id !== null],
                'line'   => ['connected' => $this->line_id !== null],
            ],
            'documents'          => $this->when(
                $this->relationLoaded('documents'),
                fn () => $this->documents->map(fn ($doc) => [
                    'id'                 => $doc->id,
                    'type'               => $doc->type->value,
                    'type_label'         => $doc->type->label(),
                    'subtype'            => $doc->subtype,
                    'expiry_date'        => $doc->expiry_date?->format('Y-m-d'),
                    'extension_date'     => $doc->extension_date?->format('Y-m-d'),
                    'is_valid_type'      => $doc->is_valid_type,
                    'validation_message' => $doc->validation_message,
                    'created_at'         => $doc->created_at->toISOString(),
                ]),
            ),
            'recent_ticket_orders' => $this->when(
                $this->relationLoaded('ticketOrders'),
                fn () => $this->ticketOrders->map(fn ($order) => [
                    'id'           => $order->id,
                    'status'       => $order->status->value,
                    'status_label' => $order->status->label(),
                    'visit_date'   => $order->visit_date->toDateString(),
                    'created_at'   => $order->created_at->toISOString(),
                    'ticket_name'  => $order->ticket?->name,
                ]),
            ),
            'recent_food_orders' => $this->when(
                $this->relationLoaded('foodOrders'),
                fn () => $this->foodOrders->map(fn ($order) => [
                    'id'           => $order->id,
                    'status'       => $order->status->value ?? $order->status,
                    'order_number' => $order->order_number,
                    'total'        => $order->total,
                    'created_at'   => $order->created_at->toISOString(),
                    'restaurant_name' => $order->restaurant?->name,
                ]),
            ),
        ];
    }
}
