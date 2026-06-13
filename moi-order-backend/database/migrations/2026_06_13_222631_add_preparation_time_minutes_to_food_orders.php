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
            // Set by merchant when transitioning to PreparingFood. Null until then.
            $table->unsignedSmallInteger('preparation_time_minutes')->nullable()->after('customer_notes');
        });
    }

    public function down(): void
    {
        Schema::table('food_orders', function (Blueprint $table): void {
            $table->dropColumn('preparation_time_minutes');
        });
    }
};
