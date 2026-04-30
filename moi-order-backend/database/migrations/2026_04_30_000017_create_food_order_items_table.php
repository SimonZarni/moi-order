<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('food_order_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('food_order_id')->constrained('food_orders')->cascadeOnDelete();
            // Nullable — item may be soft-deleted but order history must survive.
            $table->foreignId('menu_item_id')->nullable()->constrained('menu_items')->nullOnDelete();
            // Price snapshots so order history is immutable even if merchant edits menu.
            $table->string('name');
            $table->bigInteger('price_cents')->unsigned();
            $table->tinyInteger('quantity')->unsigned();
            $table->text('notes')->nullable();
            $table->bigInteger('subtotal_cents')->unsigned();
            $table->timestamps();

            $table->index('food_order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('food_order_items');
    }
};
