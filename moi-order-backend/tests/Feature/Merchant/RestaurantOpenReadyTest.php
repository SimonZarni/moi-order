<?php

declare(strict_types=1);

use App\Enums\MenuCategoryType;
use App\Enums\MenuItemStatus;
use App\Enums\RestaurantStatus;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Laravel\Sanctum\Sanctum;

uses(DatabaseTransactions::class);

function actingAsMerchantWithRestaurant(array $restaurantOverrides = []): Restaurant
{
    $user = User::factory()->create(['is_merchant' => true]);
    Sanctum::actingAs($user, ['merchant']);

    return Restaurant::create(array_merge([
        'user_id'               => $user->id,
        'name'                  => 'Test Restaurant',
        'status'                => RestaurantStatus::Closed,
        'is_delivery_available' => true,
        'is_pickup_available'   => true,
        'min_order_cents'       => 0,
    ], $restaurantOverrides));
}

function createSystemCategory(Restaurant $restaurant, MenuCategoryType $type, bool $withAvailableItem): MenuCategory
{
    $category = MenuCategory::create([
        'restaurant_id' => $restaurant->id,
        'name'          => $type->label(),
        'category_type' => $type->value,
        'sort_order'    => $type->sortOrder(),
    ]);

    if ($withAvailableItem) {
        MenuItem::create([
            'menu_category_id' => $category->id,
            'restaurant_id'    => $restaurant->id,
            'name'             => 'Item',
            'price_cents'      => 1000,
            'status'           => MenuItemStatus::Available,
            'sort_order'       => 0,
        ]);
    }

    return $category;
}

test('merchant cannot open restaurant when popular picks is empty', function (): void {
    $restaurant = actingAsMerchantWithRestaurant();

    createSystemCategory($restaurant, MenuCategoryType::PopularPicks, withAvailableItem: false);
    createSystemCategory($restaurant, MenuCategoryType::Recommendations, withAvailableItem: true);

    $this->putJson('/api/merchant/v1/restaurant', ['status' => RestaurantStatus::Open->value])
        ->assertStatus(409)
        ->assertJson(['code' => 'menu.system_category_empty']);

    expect($restaurant->fresh()->status)->toBe(RestaurantStatus::Closed);
});

test('merchant cannot open restaurant when recommendations is empty', function (): void {
    $restaurant = actingAsMerchantWithRestaurant();

    createSystemCategory($restaurant, MenuCategoryType::PopularPicks, withAvailableItem: true);
    createSystemCategory($restaurant, MenuCategoryType::Recommendations, withAvailableItem: false);

    $this->putJson('/api/merchant/v1/restaurant', ['status' => RestaurantStatus::Open->value])
        ->assertStatus(409)
        ->assertJson(['code' => 'menu.system_category_empty']);

    expect($restaurant->fresh()->status)->toBe(RestaurantStatus::Closed);
});

test('merchant can open restaurant when required system categories have items', function (): void {
    $restaurant = actingAsMerchantWithRestaurant();

    createSystemCategory($restaurant, MenuCategoryType::PopularPicks, withAvailableItem: true);
    createSystemCategory($restaurant, MenuCategoryType::Recommendations, withAvailableItem: true);
    createSystemCategory($restaurant, MenuCategoryType::Promotions, withAvailableItem: false);

    $this->putJson('/api/merchant/v1/restaurant', ['status' => RestaurantStatus::Open->value])
        ->assertOk()
        ->assertJsonPath('data.status', RestaurantStatus::Open->value);

    expect($restaurant->fresh()->status)->toBe(RestaurantStatus::Open);
});

test('merchant can close restaurant without the open-ready check', function (): void {
    $restaurant = actingAsMerchantWithRestaurant(['status' => RestaurantStatus::Open]);

    $this->putJson('/api/merchant/v1/restaurant', ['status' => RestaurantStatus::Closed->value])
        ->assertOk()
        ->assertJsonPath('data.status', RestaurantStatus::Closed->value);

    expect($restaurant->fresh()->status)->toBe(RestaurantStatus::Closed);
});
