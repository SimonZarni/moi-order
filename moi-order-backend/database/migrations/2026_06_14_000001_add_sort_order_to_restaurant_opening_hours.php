<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurant_opening_hours', function (Blueprint $table): void {
            $table->tinyInteger('sort_order')->unsigned()->default(0)->after('day_of_week');

            // MySQL requires an index on restaurant_id to back the FK constraint.
            // The composite unique (restaurant_id, day_of_week) was serving that role.
            // Add a plain index first so the FK constraint is satisfied before we
            // drop the composite unique — otherwise MySQL throws ER_DROP_INDEX_FK.
            $table->index('restaurant_id', 'restaurant_opening_hours_restaurant_id_index');

            // Allow multiple sessions per day — replace the single-session unique.
            $table->dropUnique('restaurant_opening_hours_restaurant_id_day_of_week_unique');
            $table->unique(['restaurant_id', 'day_of_week', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::table('restaurant_opening_hours', function (Blueprint $table): void {
            $table->dropUnique(['restaurant_id', 'day_of_week', 'sort_order']);
            $table->dropColumn('sort_order');
            // Restore the original single-session unique (which also backs the FK).
            $table->unique(['restaurant_id', 'day_of_week']);
            $table->dropIndex('restaurant_opening_hours_restaurant_id_index');
        });
    }
};
