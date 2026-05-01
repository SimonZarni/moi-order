<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // MariaDB does not support RENAME COLUMN; use CHANGE with full column definition
        DB::statement('ALTER TABLE food_orders CHANGE line_payment_url prompt_pay_url VARCHAR(2048) NULL');

        Schema::table('food_orders', function (Blueprint $table): void {
            // New timestamp columns for granular status tracking
            $table->timestamp('payment_confirmed_at')->nullable()->after('confirmed_at');
            $table->timestamp('preparing_at')->nullable()->after('payment_confirmed_at');
            $table->timestamp('picked_up_at')->nullable()->after('preparing_at');
            $table->timestamp('delivered_at')->nullable()->after('picked_up_at');
        });

        // Migrate existing status values to new ones
        DB::table('food_orders')->where('status', 'pending')->update(['status' => 'order_placed']);
        DB::table('food_orders')->where('status', 'confirmed')->update(['status' => 'waiting_for_payment']);
        DB::table('food_orders')->where('status', 'ready')->update(['status' => 'waiting_for_delivery']);
        // 'completed' and 'cancelled' stay the same

        // Migrate payment method
        DB::table('food_orders')->where('payment_method', 'line_pay')->update(['payment_method' => 'prompt_pay']);
    }

    public function down(): void
    {
        DB::table('food_orders')->where('status', 'order_placed')->update(['status' => 'pending']);
        DB::table('food_orders')->where('status', 'waiting_for_payment')->update(['status' => 'confirmed']);
        DB::table('food_orders')->where('status', 'payment_confirmed')->update(['status' => 'confirmed']);
        DB::table('food_orders')->where('status', 'preparing_food')->update(['status' => 'confirmed']);
        DB::table('food_orders')->where('status', 'waiting_for_delivery')->update(['status' => 'ready']);
        DB::table('food_orders')->where('status', 'delivery_on_the_way')->update(['status' => 'ready']);
        DB::table('food_orders')->where('status', 'delivered')->update(['status' => 'completed']);
        DB::table('food_orders')->where('payment_method', 'prompt_pay')->update(['payment_method' => 'line_pay']);

        DB::statement('ALTER TABLE food_orders CHANGE prompt_pay_url line_payment_url VARCHAR(2048) NULL');

        Schema::table('food_orders', function (Blueprint $table): void {
            $table->dropColumn(['payment_confirmed_at', 'preparing_at', 'picked_up_at', 'delivered_at']);
        });
    }
};
