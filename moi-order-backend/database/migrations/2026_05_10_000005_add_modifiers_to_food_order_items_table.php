<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('food_order_items', function (Blueprint $table): void {
            // Additional price from selected modifiers — server-computed, never from client.
            $table->bigInteger('additional_price_cents')->unsigned()->default(0)->after('price_cents');
            // Snapshot of selected modifiers so order history is immutable even if menu changes.
            $table->json('selected_options')->nullable()->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('food_order_items', function (Blueprint $table): void {
            $table->dropColumn(['additional_price_cents', 'selected_options']);
        });
    }
};
