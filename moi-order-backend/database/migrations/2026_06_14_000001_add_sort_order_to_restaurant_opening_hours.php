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

            // Allow multiple sessions per day — drop the old single-session unique constraint.
            $table->dropUnique('restaurant_opening_hours_restaurant_id_day_of_week_unique');
            $table->unique(['restaurant_id', 'day_of_week', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::table('restaurant_opening_hours', function (Blueprint $table): void {
            $table->dropUnique(['restaurant_id', 'day_of_week', 'sort_order']);
            $table->dropColumn('sort_order');
            $table->unique(['restaurant_id', 'day_of_week']);
        });
    }
};
