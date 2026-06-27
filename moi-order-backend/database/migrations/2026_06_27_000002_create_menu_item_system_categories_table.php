<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_item_system_categories', function (Blueprint $table): void {
            $table->foreignId('menu_item_id')
                ->constrained('menu_items')
                ->cascadeOnDelete();
            $table->foreignId('menu_category_id')
                ->constrained('menu_categories')
                ->cascadeOnDelete();

            $table->primary(['menu_item_id', 'menu_category_id']);
            $table->index('menu_category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_item_system_categories');
    }
};
