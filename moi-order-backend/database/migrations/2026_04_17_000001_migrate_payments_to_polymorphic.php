<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Converts the payments table from a direct submission_id FK to a polymorphic
 * payable_type + payable_id pair. This enables TicketOrder (and future types)
 * to share the same payments table without duplicating payment infrastructure.
 *
 * Migration strategy (safe on live data):
 *   1. Add payable_type + payable_id columns (nullable first).
 *   2. Backfill all existing rows: payable_type = ServiceSubmission FQCN, payable_id = submission_id.
 *   3. Make payable_id NOT NULL and drop submission_id FK + column.
 *   4. Add composite index on (payable_type, payable_id).
 *
 * down() reverses the operation, restoring submission_id for rollback safety.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->string('payable_type', 255)->nullable()->after('id');
            $table->unsignedBigInteger('payable_id')->nullable()->after('payable_type');
        });

        // Backfill: all existing payments belong to ServiceSubmission.
        DB::table('payments')->update([
            'payable_type' => 'App\\Models\\ServiceSubmission',
            'payable_id'   => DB::raw('submission_id'),
        ]);

        Schema::table('payments', function (Blueprint $table): void {
            $table->string('payable_type', 255)->nullable(false)->change();
            $table->unsignedBigInteger('payable_id')->nullable(false)->change();

            $table->index(['payable_type', 'payable_id'], 'payments_payable_index');

            $table->dropForeign(['submission_id']);
            $table->dropIndex(['submission_id']);
            $table->dropColumn('submission_id');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->unsignedBigInteger('submission_id')->nullable()->after('id');
        });

        // Restore submission_id for ServiceSubmission rows only.
        DB::table('payments')
            ->where('payable_type', 'App\\Models\\ServiceSubmission')
            ->update(['submission_id' => DB::raw('payable_id')]);

        Schema::table('payments', function (Blueprint $table): void {
            $table->dropIndex('payments_payable_index');
            $table->dropColumn(['payable_type', 'payable_id']);

            $table->foreign('submission_id')
                ->references('id')
                ->on('service_submissions')
                ->restrictOnDelete();

            $table->index('submission_id');
        });
    }
};
