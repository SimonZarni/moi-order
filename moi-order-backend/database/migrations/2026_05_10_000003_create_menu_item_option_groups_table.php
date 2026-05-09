<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_item_option_groups', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('menu_item_id')->constrained('menu_items')->cascadeOnDelete();
            $table->string('name', 100); // e.g., "Protein", "Size", "Extras"
            $table->boolean('is_required')->default(false);
            $table->tinyInteger('min_selections')->unsigned()->default(0);
            $table->tinyInteger('max_selections')->unsigned()->default(1); // 1 = single choice
            $table->smallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['menu_item_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_item_option_groups');
    }
};
