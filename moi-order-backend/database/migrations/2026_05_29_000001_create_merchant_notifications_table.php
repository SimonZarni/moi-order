<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Principle: SRP — one migration, one concern (merchant notification inbox).
 * Principle: MYSQL — FK on merchant_id, composite index for paginated unread queries,
 *   deleted_at indexed for soft deletes, down() written and tested.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('merchant_notifications', function (Blueprint $table): void {
            $table->id();

            // Owning merchant (user_id of the merchant).
            $table->foreignId('merchant_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // VARCHAR+CHECK instead of MySQL ENUM (per MYSQL RULES).
            $table->string('type', 50);    // new_order | order_status | system
            $table->string('title', 255);
            $table->text('body');

            // Nullable FK to the related order — NULL for system notifications.
            $table->foreignId('order_id')
                ->nullable()
                ->constrained('food_orders')
                ->nullOnDelete();

            // Null = unread; timestamp set on read.
            $table->timestamp('read_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // ── Indexes ─────────────────────────────────────────────────────
            // Paginate unread per merchant (the hottest query path).
            $table->index(['merchant_id', 'read_at'], 'mn_merchant_read_idx');
            // Newest-first listing.
            $table->index(['merchant_id', 'created_at'], 'mn_merchant_created_idx');
            // Soft-delete standard index.
            $table->index('deleted_at', 'mn_deleted_at_idx');

            // Type CHECK constraint (no MySQL ENUM as per MYSQL RULES).
            $table->string('type', 50)->change();
        });

        // CHECK constraint via raw statement (Laravel doesn't generate it in Blueprint for MySQL 8).
        \DB::statement(
            "ALTER TABLE merchant_notifications
             ADD CONSTRAINT chk_mn_type
             CHECK (`type` IN ('new_order','order_status','system'))"
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('merchant_notifications');
    }
};
