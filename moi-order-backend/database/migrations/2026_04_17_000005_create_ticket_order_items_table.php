<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ticket_order_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('ticket_order_id')
                ->constrained('ticket_orders')
                ->cascadeOnDelete();
            $table->foreignId('ticket_variant_id')
                ->constrained('ticket_variants')
                ->restrictOnDelete();

            $table->unsignedTinyInteger('quantity');
            $table->bigInteger('price_snapshot')->unsigned(); // whole THB, locked at order time

            $table->timestamps();

            $table->index('ticket_order_id');
            $table->index('ticket_variant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_order_items');
    }
};
