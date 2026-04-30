<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('menu_category_id')->constrained('menu_categories')->cascadeOnDelete();
            // Denormalised for efficient single-restaurant menu queries without joining categories.
            $table->foreignId('restaurant_id')->constrained('restaurants')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->bigInteger('price_cents')->unsigned();
            $table->string('photo_path')->nullable();
            $table->string('status', 20)->default('available');
            $table->smallInteger('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['restaurant_id', 'status', 'deleted_at']);
            $table->index(['menu_category_id', 'sort_order', 'deleted_at']);
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
