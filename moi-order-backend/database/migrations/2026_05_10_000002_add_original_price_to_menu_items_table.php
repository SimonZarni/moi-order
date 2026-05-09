<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menu_items', function (Blueprint $table): void {
            // When set and > price_cents, UI shows strikethrough original price + discount badge.
            $table->bigInteger('original_price_cents')->unsigned()->nullable()->after('price_cents');
        });
    }

    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table): void {
            $table->dropColumn('original_price_cents');
        });
    }
};
