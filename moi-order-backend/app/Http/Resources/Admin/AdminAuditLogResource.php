<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: Security — ip_address and user_agent are included for audit purposes only;
 *   never exposed to non-admin contexts.
 */
class AdminAuditLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'admin'        => [
                'id'    => $this->admin_id,
                'name'  => $this->admin_name,
                'email' => $this->admin_email,
            ],
            'action'       => $this->action->value,
            'action_label' => $this->action->label(),
            'entity_type'  => $this->entity_type,
            'entity_id'    => $this->entity_id,
            'entity_label' => $this->entity_label,
            'old_values'   => $this->old_values,
            'new_values'   => $this->new_values,
            'ip_address'   => $this->ip_address,
            'created_at'   => $this->created_at->toISOString(),
        ];
    }
}
