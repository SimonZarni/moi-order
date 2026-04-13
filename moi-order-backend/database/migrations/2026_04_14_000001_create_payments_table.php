<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Stores one payment record per Stripe PaymentIntent.
 * Multiple records per submission are allowed (e.g. after a failure + retry).
 * Security: stripe_intent_id and idempotency_key are unique to prevent duplicate processing.
 * MYSQL: BIGINT UNSIGNED money (satangs). All FK constraints explicit. Indexes on all query columns.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('submission_id')
                ->constrained('service_submissions')
                ->restrictOnDelete();

            $table->string('stripe_intent_id')->unique();
            $table->bigInteger('amount')->unsigned(); // satangs
            $table->char('currency', 3)->default('thb');
            $table->string('status', 50)->default('pending');
            $table->text('qr_image_url')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->json('stripe_payload')->nullable(); // full Stripe response for audit
            $table->uuid('idempotency_key')->unique();

            $table->timestamps();
            $table->softDeletes();

            $table->index('submission_id');
            $table->index('status');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
