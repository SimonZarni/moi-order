<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_audit_logs', static function (Blueprint $table): void {
            $table->id();

            // Snapshot the admin name/email so logs remain readable after admin deletion.
            // FK is nullable: deleting the admin user does NOT cascade-delete their history.
            $table->foreignId('admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('admin_name', 255);
            $table->string('admin_email', 255);

            // AuditAction enum value, stored as VARCHAR for readability in raw SQL.
            $table->string('action', 50);

            // Polymorphic-style entity reference (no Eloquent morph — entity may be soft-deleted).
            $table->string('entity_type', 100)->nullable();
            $table->string('entity_id', 36)->nullable();    // UUID or int-as-string
            $table->string('entity_label', 255)->nullable(); // Snapshot of display name

            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();

            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->json('metadata')->nullable();

            // Append-only: no updated_at column. created_at indexed for date-range queries.
            $table->timestamp('created_at')->useCurrent();

            // ── Indexes ────────────────────────────────────────────────────────
            $table->index('created_at');
            $table->index('action');
            // "What did admin X do between dates?" — most common filter combination.
            $table->index(['admin_id', 'created_at']);
            // "Full history of entity Y?" — used on detail pages.
            $table->index(['entity_type', 'entity_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_audit_logs');
    }
};
