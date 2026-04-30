<?php

declare(strict_types=1);

namespace App\Http\Resources\Merchant;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantUserResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'email'       => $this->email,
            'phone'       => $this->phone_number,
            'is_merchant' => $this->is_merchant,
            'created_at'  => $this->created_at?->toIso8601String(),
        ];
    }
}
