<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('food_orders', function (Blueprint $table): void {
            $table->unsignedTinyInteger('rating')->nullable()->after('cancelled_at');
            $table->text('customer_review')->nullable()->after('rating');
        });
    }

    public function down(): void
    {
        Schema::table('food_orders', function (Blueprint $table): void {
            $table->dropColumn(['rating', 'customer_review']);
        });
    }
};
