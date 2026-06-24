<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds operating hours and days to the tickets (attractions) table so the
 * user-facing app can show when a venue is open.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table): void {
            $table->string('open_time', 10)->nullable()->after('address');    // e.g. "09:00"
            $table->string('close_time', 10)->nullable()->after('open_time'); // e.g. "18:00"
            $table->string('operating_days', 100)->nullable()->after('close_time'); // e.g. "Mon – Sun"
        });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table): void {
            $table->dropColumn(['open_time', 'close_time', 'operating_days']);
        });
    }
};
