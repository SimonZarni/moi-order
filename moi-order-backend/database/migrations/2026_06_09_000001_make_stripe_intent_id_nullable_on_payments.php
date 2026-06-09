<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Allow non-Stripe payment modes (global_qr, manual_qr) by making stripe_intent_id nullable.
 * Existing Stripe rows are unaffected — their value is simply non-null.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->string('stripe_intent_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            // Null rows would violate the NOT NULL constraint — only safe to revert
            // on a dev database with no non-Stripe rows.
            $table->string('stripe_intent_id')->nullable(false)->change();
        });
    }
};
