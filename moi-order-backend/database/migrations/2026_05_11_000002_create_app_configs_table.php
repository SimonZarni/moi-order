<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Single-row app configuration table.
 *
 * No FKs (no relations). No soft deletes (config is never "deleted", only reset).
 * Money: N/A. Enums stored as VARCHAR + application-level cast (no MySQL ENUM type).
 * Index: no WHERE/ORDER BY patterns on this table (always read as firstOrCreate) → no index needed.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('app_configs', static function (Blueprint $table): void {
            $table->id();

            // ── Update gating ──────────────────────────────────────────────
            $table->string('ios_min_version', 20)->nullable();
            $table->string('android_min_version', 20)->nullable();
            // Mirrors AppUpdateType enum: none | optional | required
            $table->string('update_type', 20)->default('none');
            $table->string('update_title', 255)->nullable();
            $table->string('update_message', 1000)->nullable();
            $table->string('ios_store_url', 500)->nullable();
            $table->string('android_store_url', 500)->nullable();

            // ── In-app alert ───────────────────────────────────────────────
            $table->boolean('alert_is_active')->default(false);
            $table->string('alert_title', 255)->nullable();
            $table->string('alert_message', 1000)->nullable();
            // Mirrors AppAlertFrequency enum: once_per_day | every_open
            $table->string('alert_frequency', 20)->default('once_per_day');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('app_configs');
    }
};
