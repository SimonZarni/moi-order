<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\AppConfig;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public-facing serialisation of AppConfig.
 *
 * SRP: shapes the JSON contract for the client app only.
 * Never expose raw model fields — explicit toArray() ensures no surprise field leakage.
 *
 * @mixin AppConfig
 */
class AppConfigPublicResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'update' => [
                'ios_min_version'     => $this->ios_min_version,
                'android_min_version' => $this->android_min_version,
                'type'                => $this->update_type->value,
                'title'               => $this->update_title,
                'message'             => $this->update_message,
                'ios_store_url'       => $this->ios_store_url,
                'android_store_url'   => $this->android_store_url,
            ],
            'alert' => [
                'is_active' => $this->alert_is_active,
                'title'     => $this->alert_title,
                'message'   => $this->alert_message,
                'frequency' => $this->alert_frequency->value,
            ],
        ];
    }
}
