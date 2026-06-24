<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds merchant_reply and merchant_replied_at to food_orders so restaurant
 * owners can respond to customer reviews.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('food_orders', function (Blueprint $table): void {
            $table->text('merchant_reply')->nullable()->after('customer_review');
            $table->timestamp('merchant_replied_at')->nullable()->after('merchant_reply');
        });
    }

    public function down(): void
    {
        Schema::table('food_orders', function (Blueprint $table): void {
            $table->dropColumn(['merchant_reply', 'merchant_replied_at']);
        });
    }
};
