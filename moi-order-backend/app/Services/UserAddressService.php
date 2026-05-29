<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\AddressLabel;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class UserAddressService
{
    /** @return Collection<int, UserAddress> */
    public function listForUser(int $userId): Collection
    {
        return UserAddress::forUser($userId)
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();
    }

    /** @param array<string, mixed> $data */
    public function create(int $userId, array $data): UserAddress
    {
        return DB::transaction(function () use ($userId, $data): UserAddress {
            $address = UserAddress::create([
                'user_id'    => $userId,
                'label'      => AddressLabel::from($data['label']),
                'address'    => $data['address'],
                'building'   => $data['building'] ?? null,
                'floor'      => $data['floor'] ?? null,
                'landmark'       => $data['landmark'] ?? null,
                'province'       => $data['province'] ?? null,
                'contact_name'   => $data['contact_name'] ?? null,
                'contact_phone'  => $data['contact_phone'] ?? null,
                'latitude'       => isset($data['latitude']) ? (float) $data['latitude'] : null,
                'longitude'  => isset($data['longitude']) ? (float) $data['longitude'] : null,
                'is_default' => false,
            ]);

            if (! empty($data['is_default'])) {
                $address->setAsDefault();
            } elseif (! UserAddress::forUser($userId)->where('id', '!=', $address->id)->exists()) {
                // First address ever — auto-default.
                $address->update(['is_default' => true]);
            }

            return $address->fresh();
        });
    }

    /** @param array<string, mixed> $data */
    public function update(UserAddress $address, array $data): UserAddress
    {
        return DB::transaction(function () use ($address, $data): UserAddress {
            $updates = [];

            if (isset($data['label']))   $updates['label']   = AddressLabel::from($data['label']);
            if (isset($data['address'])) $updates['address'] = $data['address'];

            if (array_key_exists('building', $data)) $updates['building'] = $data['building'];
            if (array_key_exists('floor', $data))    $updates['floor']    = $data['floor'];
            if (array_key_exists('landmark', $data)) $updates['landmark'] = $data['landmark'];
            if (array_key_exists('province', $data))       $updates['province']       = $data['province'];
            if (array_key_exists('contact_name', $data))   $updates['contact_name']   = $data['contact_name'];
            if (array_key_exists('contact_phone', $data))  $updates['contact_phone']  = $data['contact_phone'];
            if (array_key_exists('latitude', $data)) {
                $updates['latitude'] = $data['latitude'] !== null ? (float) $data['latitude'] : null;
            }
            if (array_key_exists('longitude', $data)) {
                $updates['longitude'] = $data['longitude'] !== null ? (float) $data['longitude'] : null;
            }

            if (! empty($updates)) {
                $address->update($updates);
            }

            if (! empty($data['is_default'])) {
                $address->setAsDefault();
            }

            return $address->fresh();
        });
    }

    public function delete(UserAddress $address): void
    {
        DB::transaction(function () use ($address): void {
            $wasDefault = $address->is_default;
            $userId     = $address->user_id;
            $address->delete();

            if ($wasDefault) {
                $next = UserAddress::forUser($userId)->latest()->first();
                $next?->update(['is_default' => true]);
            }
        });
    }

    public function setDefault(UserAddress $address): UserAddress
    {
        DB::transaction(static function () use ($address): void {
            $address->setAsDefault();
        });

        return $address->fresh();
    }
}
