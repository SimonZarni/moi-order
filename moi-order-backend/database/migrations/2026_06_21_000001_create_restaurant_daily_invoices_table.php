<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurant_daily_invoices', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('restaurant_id')->constrained('restaurants')->cascadeOnDelete();

            $table->date('date');

            $table->unsignedInteger('order_count')->default(0);
            $table->unsignedBigInteger('customer_total_cents')->default(0);
            $table->unsignedBigInteger('platform_fee_cents')->default(0);
            $table->unsignedBigInteger('payout_cents')->default(0);

            $table->string('status', 20)->default('pending');
            // No FK constraint — admin model source of truth may differ per deployment
            $table->unsignedBigInteger('confirmed_by_id')->nullable();
            $table->timestamp('paid_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['restaurant_id', 'date']);
            $table->index('date');
            $table->index('status');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurant_daily_invoices');
    }
};
