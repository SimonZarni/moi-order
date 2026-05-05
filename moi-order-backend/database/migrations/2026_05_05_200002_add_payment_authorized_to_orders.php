<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Existing orders default to true so they're not blocked retroactively.
        Schema::table('ticket_orders', function (Blueprint $table): void {
            $table->boolean('payment_authorized')->default(true)->after('status');
        });

        Schema::table('service_submissions', function (Blueprint $table): void {
            $table->boolean('payment_authorized')->default(true)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_orders', function (Blueprint $table): void {
            $table->dropColumn('payment_authorized');
        });
        Schema::table('service_submissions', function (Blueprint $table): void {
            $table->dropColumn('payment_authorized');
        });
    }
};
