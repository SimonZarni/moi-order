<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('food_orders', function (Blueprint $table) {
            $table->string('cancel_reason')->nullable()->after('cancelled_at');
            $table->text('cancel_description')->nullable()->after('cancel_reason');
        });
    }

    public function down(): void
    {
        Schema::table('food_orders', function (Blueprint $table) {
            $table->dropColumn(['cancel_reason', 'cancel_description']);
        });
    }
};
