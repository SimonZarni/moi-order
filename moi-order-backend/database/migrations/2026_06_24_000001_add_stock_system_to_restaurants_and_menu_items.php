<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table): void {
            $table->boolean('use_stock_system')->default(false)->after('min_order_cents');
        });

        Schema::table('menu_items', function (Blueprint $table): void {
            // NULL = unlimited (no tracking). 0 = out of stock. >0 = available quantity.
            $table->unsignedInteger('stock_quantity')->nullable()->after('sort_order');
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table): void {
            $table->dropColumn('use_stock_system');
        });

        Schema::table('menu_items', function (Blueprint $table): void {
            $table->dropColumn('stock_quantity');
        });
    }
};
