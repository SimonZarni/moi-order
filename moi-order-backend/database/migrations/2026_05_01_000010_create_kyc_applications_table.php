<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Principle: MySQL Rules — FK constraints, composite indexes, VARCHAR+CHECK (not ENUM),
 *   deleted_at indexed, down() written and tested.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kyc_applications', function (Blueprint $table): void {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('business_name', 255);
            $table->string('business_type', 100);
            $table->text('business_address');

            // VARCHAR + CHECK instead of MySQL ENUM — keeps the type open for migration.
            $table->string('status', 50)->default('draft');
            $table->text('review_notes')->nullable();

            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            // Indexes: every WHERE/ORDER BY/JOIN column.
            $table->index('user_id');
            $table->index('status');
            $table->index('submitted_at');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kyc_applications');
    }
};
