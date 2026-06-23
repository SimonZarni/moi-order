<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menu_categories', function (Blueprint $table): void {
            $table->unsignedBigInteger('opening_hour_id')
                ->nullable()
                ->after('restaurant_id');

            $table->foreign('opening_hour_id')
                ->references('id')
                ->on('restaurant_opening_hours')
                ->cascadeOnDelete();

            // Composite index for fetching a session's categories efficiently.
            $table->index(['restaurant_id', 'opening_hour_id']);
        });
    }

    public function down(): void
    {
        Schema::table('menu_categories', function (Blueprint $table): void {
            $table->dropForeign(['opening_hour_id']);
            $table->dropIndex(['restaurant_id', 'opening_hour_id']);
            $table->dropColumn('opening_hour_id');
        });
    }
};
