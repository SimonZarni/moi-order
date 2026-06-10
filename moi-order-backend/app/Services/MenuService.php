<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\Enums\MenuCategoryType;
use App\Enums\MenuItemStatus;
use App\Exceptions\DomainException;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\MenuItemOptionGroup;
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

    // ─── System categories ────────────────────────────────────────────────────

    /**
     * Idempotent: only creates system categories that don't already exist.
     * Called on restaurant creation and safe to re-run on existing restaurants.
     */
    public function createSystemCategoriesForRestaurant(Restaurant $restaurant): void
    {
        foreach (MenuCategoryType::cases() as $type) {
            $exists = $restaurant->menuCategories()
                ->where('category_type', $type->value)
                ->withTrashed()
                ->exists();

            if (! $exists) {
                MenuCategory::create([
                    'restaurant_id' => $restaurant->id,
                    'name'          => $type->label(),
                    'category_type' => $type->value,
                    'sort_order'    => $type->sortOrder(),
                ]);
            }
        }
    }

    /**
     * Throws DomainException if the restaurant is not ready to open.
     * Rule: required system categories (Popular Picks, Recommendations) must each
     * have at least one available item.
     */
    public function validateOpenReady(Restaurant $restaurant): void
    {
        $restaurant->load('menuCategories.menuItems');

        foreach (MenuCategoryType::cases() as $type) {
            if (! $type->isRequired()) {
                continue;
            }

            $category = $restaurant->menuCategories
                ->first(fn ($c) => $c->category_type === $type);

            $hasItems = $category !== null
                && $category->menuItems->where('status', MenuItemStatus::Available)->isNotEmpty();

            if (! $hasItems) {
                throw new DomainException('menu.system_category_empty');
            }
        }
    }

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
        if ($category->isSystem()) {
            throw new DomainException('menu.system_category_immutable');
        }

        $category->update(array_filter([
            'name'       => $data['name'] ?? null,
            'sort_order' => $data['sort_order'] ?? null,
        ], fn ($v) => $v !== null));

        return $category->fresh();
    }

    public function deleteCategory(MenuCategory $category): void
    {
        if ($category->isSystem()) {
            throw new DomainException('menu.system_category_immutable');
        }

        if ($category->menuItems()->exists()) {
            throw new DomainException('menu.category_has_items');
        }

        $category->delete();
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

            $item = MenuItem::create([
                'menu_category_id'     => $category->id,
                'restaurant_id'        => $restaurant->id,
                'name'                 => $data['name'],
                'description'          => $data['description'] ?? null,
                'price_cents'          => (int) $data['price_cents'],
                'original_price_cents' => isset($data['original_price_cents']) ? (int) $data['original_price_cents'] : null,
                'photo_path'           => $photoPath,
                'status'               => MenuItemStatus::Available,
                'sort_order'           => $data['sort_order'] ?? 0,
            ]);

            if (! empty($data['option_groups'])) {
                $this->syncOptionGroups($item, $data['option_groups']);
            }

            return $item->load('optionGroups.options');
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
            if (array_key_exists('original_price_cents', $data)) {
                $updates['original_price_cents'] = $data['original_price_cents'] !== null
                    ? (int) $data['original_price_cents'] : null;
            }
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

            if (array_key_exists('option_groups', $data)) {
                $this->syncOptionGroups($item, $data['option_groups'] ?? []);
            }

            return $item->load('optionGroups.options');
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

    /**
     * Replace all option groups for a menu item.
     * Principle: CQS — mutates option groups, returns void.
     *
     * @param array<int, array<string, mixed>> $groups
     */
    private function syncOptionGroups(MenuItem $item, array $groups): void
    {
        $item->optionGroups()->delete();

        foreach ($groups as $i => $groupData) {
            $group = MenuItemOptionGroup::create([
                'menu_item_id'   => $item->id,
                'name'           => $groupData['name'],
                'is_required'    => (bool) ($groupData['is_required'] ?? false),
                'min_selections' => (int) ($groupData['min_selections'] ?? 0),
                'max_selections' => (int) ($groupData['max_selections'] ?? 1),
                'sort_order'     => $i,
            ]);

            foreach ($groupData['options'] ?? [] as $j => $optData) {
                $group->options()->create([
                    'name'                    => $optData['name'],
                    'additional_price_cents'  => (int) ($optData['additional_price_cents'] ?? 0),
                    'is_available'            => true,
                    'sort_order'              => $j,
                ]);
            }
        }
    }
}
