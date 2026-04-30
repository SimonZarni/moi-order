<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\Enums\MenuItemStatus;
use App\Exceptions\DomainException;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Restaurant;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — menu category and item CRUD only.
 * Principle: Security — all writes are scoped to the merchant's restaurant (user-scope).
 */
class MenuService
{
    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    // ─── Categories ───────────────────────────────────────────────────────────

    /** @param array<string, mixed> $data */
    public function createCategory(Restaurant $restaurant, array $data): MenuCategory
    {
        return MenuCategory::create([
            'restaurant_id' => $restaurant->id,
            'name'          => $data['name'],
            'sort_order'    => $data['sort_order'] ?? 0,
        ]);
    }

    /** @param array<string, mixed> $data */
    public function updateCategory(MenuCategory $category, array $data): MenuCategory
    {
        $category->update(array_filter([
            'name'       => $data['name'] ?? null,
            'sort_order' => $data['sort_order'] ?? null,
        ], fn ($v) => $v !== null));

        return $category->fresh();
    }

    public function deleteCategory(MenuCategory $category): void
    {
        DB::transaction(function () use ($category): void {
            // Soft-delete items before category so FK stays valid for order history.
            $category->menuItems()->delete();
            $category->delete();
        });
    }

    // ─── Items ────────────────────────────────────────────────────────────────

    /** @param array<string, mixed> $data */
    public function createItem(Restaurant $restaurant, MenuCategory $category, array $data): MenuItem
    {
        return DB::transaction(function () use ($restaurant, $category, $data): MenuItem {
            $photoPath = null;
            if (isset($data['photo'])) {
                $photoPath = $this->storage->store($data['photo'], 'menu/photos');
            }

            return MenuItem::create([
                'menu_category_id' => $category->id,
                'restaurant_id'    => $restaurant->id,
                'name'             => $data['name'],
                'description'      => $data['description'] ?? null,
                'price_cents'      => (int) $data['price_cents'],
                'photo_path'       => $photoPath,
                'status'           => MenuItemStatus::Available,
                'sort_order'       => $data['sort_order'] ?? 0,
            ]);
        });
    }

    /** @param array<string, mixed> $data */
    public function updateItem(MenuItem $item, array $data): MenuItem
    {
        return DB::transaction(function () use ($item, $data): MenuItem {
            $updates = [];

            if (isset($data['name']))             $updates['name']             = $data['name'];
            if (isset($data['description']))      $updates['description']      = $data['description'];
            if (isset($data['price_cents']))      $updates['price_cents']      = (int) $data['price_cents'];
            if (isset($data['menu_category_id'])) $updates['menu_category_id'] = $data['menu_category_id'];
            if (isset($data['status']))           $updates['status']           = MenuItemStatus::from($data['status']);
            if (isset($data['sort_order']))       $updates['sort_order']       = $data['sort_order'];

            if (isset($data['photo'])) {
                if ($item->photo_path !== null) {
                    $this->storage->delete($item->photo_path);
                }
                $updates['photo_path'] = $this->storage->store($data['photo'], 'menu/photos');
            }

            $item->update($updates);

            return $item->fresh();
        });
    }

    public function deleteItem(MenuItem $item): void
    {
        DB::transaction(function () use ($item): void {
            if ($item->photo_path !== null) {
                $this->storage->delete($item->photo_path);
            }
            $item->delete();
        });
    }
}
