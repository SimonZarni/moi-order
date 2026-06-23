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
            $table->boolean('session_menu_enabled')->default(true)->after('is_closed');
        });
    }

    public function down(): void
    {
        Schema::table('restaurant_opening_hours', function (Blueprint $table): void {
            $table->dropColumn('session_menu_enabled');
        });
    }
};
