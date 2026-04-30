<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\MenuItemStatus;
use App\Enums\RestaurantStatus;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Models\RestaurantOpeningHour;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RestaurantSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $merchant1 = User::firstOrCreate(
            ['email' => 'merchant1@example.com'],
            [
                'name'     => 'Somchai Restaurant Group',
                'password' => Hash::make('password'),
            ]
        );

        $merchant2 = User::firstOrCreate(
            ['email' => 'merchant2@example.com'],
            [
                'name'     => 'Siriporn Kitchen Co.',
                'password' => Hash::make('password'),
            ]
        );

        $this->seedRestaurant(
            merchant: $merchant1,
            data: [
                'name'                  => 'Bangkok Bites',
                'description'           => 'Authentic Thai street food — pad thai, som tum, mango sticky rice, and more. Fresh ingredients, bold flavours.',
                'address'               => '42 Sukhumvit Soi 11, Watthana, Bangkok 10110',
                'latitude'              => 13.7418,
                'longitude'             => 100.5592,
                'phone'                 => '+66 2 123 4567',
                'status'                => RestaurantStatus::Open,
                'delivery_radius_km'    => 5.0,
                'is_delivery_available' => true,
                'is_pickup_available'   => true,
                'min_order_cents'       => 15000,
            ],
            menu: [
                [
                    'category' => 'Starters',
                    'sort_order' => 1,
                    'items' => [
                        ['name' => 'Spring Rolls (4 pcs)', 'description' => 'Crispy fried rolls stuffed with glass noodles, carrot, and cabbage. Served with sweet chilli sauce.', 'price_cents' => 8000, 'sort_order' => 1],
                        ['name' => 'Satay Chicken (5 pcs)', 'description' => 'Grilled marinated chicken skewers with peanut sauce and cucumber relish.', 'price_cents' => 12000, 'sort_order' => 2],
                        ['name' => 'Tom Yum Soup', 'description' => 'Spicy & sour lemongrass broth with prawns, mushrooms, galangal, kaffir lime leaves.', 'price_cents' => 15000, 'sort_order' => 3],
                        ['name' => 'Papaya Salad (Som Tum)', 'description' => 'Classic green papaya salad with chilli, lime, fish sauce, and dried shrimp.', 'price_cents' => 9000, 'sort_order' => 4],
                    ],
                ],
                [
                    'category' => 'Mains',
                    'sort_order' => 2,
                    'items' => [
                        ['name' => 'Pad Thai (Chicken)', 'description' => 'Stir-fried rice noodles with chicken, egg, bean sprouts, green onion, and crushed peanuts.', 'price_cents' => 18000, 'sort_order' => 1],
                        ['name' => 'Pad Thai (Prawns)', 'description' => 'Stir-fried rice noodles with tiger prawns, egg, bean sprouts, and tamarind sauce.', 'price_cents' => 22000, 'sort_order' => 2],
                        ['name' => 'Green Curry (Chicken)', 'description' => 'Creamy green curry with coconut milk, bamboo shoots, Thai basil. Served with jasmine rice.', 'price_cents' => 20000, 'sort_order' => 3],
                        ['name' => 'Massaman Beef Curry', 'description' => 'Rich, mildly spiced curry with slow-braised beef, potato, and roasted peanuts.', 'price_cents' => 24000, 'sort_order' => 4],
                        ['name' => 'Basil Stir-Fry (Pork)', 'description' => 'Minced pork wok-tossed with Thai holy basil, garlic, and chilli. Served over rice with fried egg.', 'price_cents' => 16000, 'sort_order' => 5],
                        ['name' => 'Pineapple Fried Rice', 'description' => 'Fragrant fried rice with pineapple chunks, cashews, raisins, and your choice of chicken or shrimp.', 'price_cents' => 17000, 'sort_order' => 6],
                    ],
                ],
                [
                    'category' => 'Desserts',
                    'sort_order' => 3,
                    'items' => [
                        ['name' => 'Mango Sticky Rice', 'description' => 'Sweet glutinous rice topped with fresh mango slices and drizzled with coconut cream.', 'price_cents' => 12000, 'sort_order' => 1],
                        ['name' => 'Coconut Ice Cream', 'description' => 'Homemade coconut ice cream served in a coconut shell with toppings.', 'price_cents' => 10000, 'sort_order' => 2],
                        ['name' => 'Banana Fritters', 'description' => 'Deep-fried banana in a light batter, served with honey and sesame seeds.', 'price_cents' => 8000, 'sort_order' => 3],
                    ],
                ],
                [
                    'category' => 'Drinks',
                    'sort_order' => 4,
                    'items' => [
                        ['name' => 'Thai Iced Tea', 'description' => 'Strong brewed Ceylon tea sweetened with sugar and topped with condensed milk over ice.', 'price_cents' => 7000, 'sort_order' => 1],
                        ['name' => 'Fresh Coconut Water', 'description' => 'Chilled young coconut water served in the coconut. Refreshing and natural.', 'price_cents' => 9000, 'sort_order' => 2],
                        ['name' => 'Lemongrass Cooler', 'description' => 'Freshly brewed lemongrass tea with honey and a splash of lime, served over ice.', 'price_cents' => 8000, 'sort_order' => 3],
                        ['name' => 'Sparkling Water', 'description' => 'Chilled sparkling mineral water.', 'price_cents' => 5000, 'sort_order' => 4],
                    ],
                ],
            ]
        );

        $this->seedRestaurant(
            merchant: $merchant2,
            data: [
                'name'                  => 'Siriporn\'s Kitchen',
                'description'           => 'Homestyle Thai-Japanese fusion. Serving comfort food with a twist — from tonkotsu with Thai spice to miso-glazed ribs.',
                'address'               => '88 Thonglor Road, Khlong Toei Nuea, Bangkok 10110',
                'latitude'              => 13.7305,
                'longitude'             => 100.5840,
                'phone'                 => '+66 2 987 6543',
                'status'                => RestaurantStatus::Open,
                'delivery_radius_km'    => 3.5,
                'is_delivery_available' => true,
                'is_pickup_available'   => true,
                'min_order_cents'       => 20000,
            ],
            menu: [
                [
                    'category' => 'Small Plates',
                    'sort_order' => 1,
                    'items' => [
                        ['name' => 'Edamame', 'description' => 'Steamed salted edamame beans. Simple, classic.', 'price_cents' => 6000, 'sort_order' => 1],
                        ['name' => 'Gyoza (6 pcs)', 'description' => 'Pan-fried pork and cabbage dumplings with Thai-style dipping sauce.', 'price_cents' => 11000, 'sort_order' => 2],
                        ['name' => 'Spicy Tuna Tartare', 'description' => 'Fresh tuna with sriracha mayo, sesame oil, cucumber, and crispy wonton chips.', 'price_cents' => 18000, 'sort_order' => 3],
                        ['name' => 'Karaage Chicken', 'description' => 'Japanese-style fried chicken marinated in ginger soy, served with kaffir lime aioli.', 'price_cents' => 14000, 'sort_order' => 4],
                    ],
                ],
                [
                    'category' => 'Ramen & Noodles',
                    'sort_order' => 2,
                    'items' => [
                        ['name' => 'Tonkotsu Ramen', 'description' => 'Rich pork bone broth with chashu pork, soft-boiled egg, nori, bamboo shoots, and spring onion.', 'price_cents' => 28000, 'sort_order' => 1],
                        ['name' => 'Thai Spice Ramen', 'description' => 'Tonkotsu base infused with lemongrass and galangal, topped with chilli oil. A fusion classic.', 'price_cents' => 30000, 'sort_order' => 2],
                        ['name' => 'Pad See Ew', 'description' => 'Wide rice noodles stir-fried with dark soy sauce, egg, Chinese broccoli, and beef.', 'price_cents' => 19000, 'sort_order' => 3],
                        ['name' => 'Vegetarian Soba', 'description' => 'Cold buckwheat noodles with miso dashi, pickled vegetables, and tofu.', 'price_cents' => 16000, 'sort_order' => 4],
                    ],
                ],
                [
                    'category' => 'Rice Bowls',
                    'sort_order' => 3,
                    'items' => [
                        ['name' => 'Miso-Glazed Salmon Donburi', 'description' => 'Pan-seared miso-glazed salmon over steamed rice with pickled ginger and sesame.', 'price_cents' => 32000, 'sort_order' => 1],
                        ['name' => 'Spicy Basil Beef Bowl', 'description' => 'Ground wagyu beef wok-tossed with Thai holy basil over jasmine rice. Topped with fried egg.', 'price_cents' => 28000, 'sort_order' => 2],
                        ['name' => 'Teriyaki Chicken Rice', 'description' => 'Grilled teriyaki chicken thigh over seasoned Japanese short-grain rice with pickled cucumber.', 'price_cents' => 24000, 'sort_order' => 3],
                    ],
                ],
                [
                    'category' => 'Drinks',
                    'sort_order' => 4,
                    'items' => [
                        ['name' => 'Matcha Latte (Hot)', 'description' => 'Ceremonial grade matcha whisked with oat milk. Earthy and smooth.', 'price_cents' => 9000, 'sort_order' => 1],
                        ['name' => 'Yuzu Soda', 'description' => 'Sparkling water with yuzu juice and a hint of honey. Light and citrusy.', 'price_cents' => 8000, 'sort_order' => 2],
                        ['name' => 'Japanese Iced Coffee', 'description' => 'Pour-over coffee brewed directly over ice. Clean, crisp, and refreshing.', 'price_cents' => 9500, 'sort_order' => 3],
                        ['name' => 'Thai Milk Tea', 'description' => 'Classic strong-brew Thai tea with sweetened milk and ice.', 'price_cents' => 7500, 'sort_order' => 4],
                    ],
                ],
            ]
        );
    }

    /**
     * @param  array<string, mixed>                                  $data
     * @param  array<int, array{category:string,sort_order:int,items:array<int,array<string,mixed>>}>  $menu
     */
    private function seedRestaurant(User $merchant, array $data, array $menu): void
    {
        /** @var Restaurant $restaurant */
        $restaurant = Restaurant::firstOrCreate(
            ['name' => $data['name'], 'user_id' => $merchant->id],
            $data
        );

        // Opening hours — Mon-Fri 10:00-22:00, Sat-Sun 09:00-23:00.
        $hours = [];
        for ($day = 0; $day <= 6; $day++) {
            $isWeekend = in_array($day, [0, 6], true);
            $hours[] = [
                'restaurant_id' => $restaurant->id,
                'day_of_week'   => $day,
                'opens_at'      => $isWeekend ? '09:00:00' : '10:00:00',
                'closes_at'     => $isWeekend ? '23:00:00' : '22:00:00',
                'is_closed'     => false,
            ];
        }
        foreach ($hours as $h) {
            RestaurantOpeningHour::updateOrCreate(
                ['restaurant_id' => $h['restaurant_id'], 'day_of_week' => $h['day_of_week']],
                $h
            );
        }

        // Menu categories and items.
        foreach ($menu as $categoryData) {
            /** @var MenuCategory $category */
            $category = MenuCategory::firstOrCreate(
                ['restaurant_id' => $restaurant->id, 'name' => $categoryData['category']],
                ['sort_order' => $categoryData['sort_order']]
            );

            foreach ($categoryData['items'] as $itemData) {
                MenuItem::firstOrCreate(
                    ['menu_category_id' => $category->id, 'name' => $itemData['name']],
                    [
                        'restaurant_id' => $restaurant->id,
                        'description'   => $itemData['description'],
                        'price_cents'   => $itemData['price_cents'],
                        'status'        => MenuItemStatus::Available,
                        'sort_order'    => $itemData['sort_order'],
                    ]
                );
            }
        }
    }
}
