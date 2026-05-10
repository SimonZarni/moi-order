<?php

declare(strict_types=1);

use App\Enums\MenuCategoryType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menu_categories', function (Blueprint $table): void {
            $table->string('category_type', 30)->nullable()->after('sort_order');
            $table->index(['restaurant_id', 'category_type']);
        });

        // Seed system categories for every existing restaurant that doesn't have them yet.
        // Idempotent: skips restaurants that already have a given system category type.
        $restaurantIds = DB::table('restaurants')->pluck('id');

        foreach ($restaurantIds as $restaurantId) {
            foreach (MenuCategoryType::cases() as $type) {
                $exists = DB::table('menu_categories')
                    ->where('restaurant_id', $restaurantId)
                    ->where('category_type', $type->value)
                    ->whereNull('deleted_at')
                    ->exists();

                if (! $exists) {
                    DB::table('menu_categories')->insert([
                        'restaurant_id' => $restaurantId,
                        'name'          => $type->label(),
                        'category_type' => $type->value,
                        'sort_order'    => $type->sortOrder(),
                        'created_at'    => now(),
                        'updated_at'    => now(),
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::table('menu_categories', function (Blueprint $table): void {
            $table->dropIndex(['restaurant_id', 'category_type']);
            $table->dropColumn('category_type');
        });
    }
};
