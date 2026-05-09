<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_item_options', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('option_group_id')
                ->constrained('menu_item_option_groups')
                ->cascadeOnDelete();
            $table->string('name', 100); // e.g., "Pork", "Large", "Extra sauce"
            // Positive = add to item price. Zero = free modifier.
            $table->bigInteger('additional_price_cents')->unsigned()->default(0);
            $table->boolean('is_available')->default(true);
            $table->smallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['option_group_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_item_options');
    }
};
