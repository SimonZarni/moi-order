<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds Google Places integration fields to the places table.
 * Principle: YAGNI / additive — no existing column is touched.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('places', function (Blueprint $table): void {
            $table->string('google_place_id', 255)->nullable()->after('google_map_url');

            // VARCHAR + CHECK constraint — not MySQL ENUM per project conventions.
            $table->string('google_match_status', 20)->nullable()->after('google_place_id');

            $table->index('google_place_id', 'places_google_place_id_idx');
        });
    }

    public function down(): void
    {
        Schema::table('places', function (Blueprint $table): void {
            $table->dropIndex('places_google_place_id_idx');
            $table->dropColumn(['google_place_id', 'google_match_status']);
        });
    }
};
