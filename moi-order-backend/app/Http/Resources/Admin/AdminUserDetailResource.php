<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
// AdminUserDocumentResource is in the same namespace — no use needed

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
                ? resolve(FileStorageInterface::class)->publicUrl($this->profile_picture_path)
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
                fn () => AdminUserDocumentResource::collection($this->documents),
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
            'service_submissions' => $this->when(
                $this->relationLoaded('serviceSubmissions'),
                fn () => $this->serviceSubmissions->map(fn ($sub) => [
                    'id'           => $sub->id,
                    'status'       => $sub->status->value,
                    'status_label' => $sub->status->label(),
                    'service_name' => $sub->serviceType?->service?->name_en
                        ?? $sub->serviceType?->service?->name_mm
                        ?? $sub->serviceType?->name_en
                        ?? $sub->serviceType?->name_mm
                        ?? '—',
                    'type_name'    => $sub->serviceType?->name_en
                        ?? $sub->serviceType?->name_mm
                        ?? null,
                    'created_at'   => $sub->created_at->toISOString(),
                ]),
            ),
        ];
    }
}
