<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use App\Models\AppConfig;
use App\Models\InAppAlert;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public-facing serialisation of AppConfig + active in-app alerts.
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
        $storage = resolve(FileStorageInterface::class);

        $alerts = InAppAlert::where('is_active', true)
            ->orderBy('frequency')
            ->get()
            ->map(fn (InAppAlert $a) => [
                'id'        => $a->id,
                'title'     => $a->title,
                'message'   => $a->message,
                // 24 h TTL — practical for images cached on device at launch.
                'image_url' => $a->image_path ? $storage->url($a->image_path, 1440) : null,
                'frequency' => $a->frequency->value,
            ])
            ->values();

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
            'alerts' => $alerts,
        ];
    }
}
