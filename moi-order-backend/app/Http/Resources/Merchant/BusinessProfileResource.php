<?php

declare(strict_types=1);

namespace App\Http\Resources\Merchant;

use App\Contracts\FileStorageInterface;
use App\Models\KycApplication;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes the combined business profile API output.
 * Principle: Security — file_path never exposed; signed URLs via FileStorageInterface.
 * $this->resource is: array{user: User, kyc: KycApplication|null, restaurant: Restaurant|null}
 */
class BusinessProfileResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        /** @var User $user */
        $user = $this->resource['user'];
        /** @var KycApplication|null $kyc */
        $kyc = $this->resource['kyc'];
        /** @var Restaurant|null $restaurant */
        $restaurant = $this->resource['restaurant'];

        /** @var FileStorageInterface $storage */
        $storage = app(FileStorageInterface::class);

        return [
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone_number,
            ],
            'kyc'        => $kyc !== null
                ? (new KycApplicationResource($kyc->loadMissing('documents')))->toArray($request)
                : null,
            'restaurant' => $restaurant !== null
                ? [
                    'id'                    => $restaurant->id,
                    'name'                  => $restaurant->name,
                    'description'           => $restaurant->description,
                    'address'               => $restaurant->address,
                    'phone'                 => $restaurant->phone,
                    'status'                => $restaurant->status->value,
                    'status_label'          => $restaurant->status->label(),
                    'cover_photo_url'       => $restaurant->cover_photo_path !== null
                        ? $storage->publicUrl($restaurant->cover_photo_path)
                        : null,
                    'logo_url'              => $restaurant->logo_path !== null
                        ? $storage->publicUrl($restaurant->logo_path)
                        : null,
                    'is_delivery_available' => $restaurant->is_delivery_available,
                    'is_pickup_available'   => $restaurant->is_pickup_available,
                    'min_order_cents'       => $restaurant->min_order_cents,
                    'delivery_radius_km'    => $restaurant->delivery_radius_km,
                ]
                : null,
        ];
    }
}
