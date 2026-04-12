<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Performance: the paginated list query is:
//   WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 20
// The existing single-column user_id index forces MySQL to scan all rows for
// that user and then filesort by created_at.
// A composite (user_id, created_at) index lets MySQL satisfy both the filter
// and the sort from a single index range scan — no filesort — which matters
// when a user has thousands of submissions.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_submissions', function (Blueprint $table): void {
            // Add the composite index first so MySQL has an alternative index
            // covering user_id before we drop the single-column one.
            // MySQL requires at least one index covering the FK column at all times.
            $table->index(['user_id', 'created_at'], 'submissions_user_created_idx');
        });

        Schema::table('service_submissions', function (Blueprint $table): void {
            // Now safe to drop — the composite (user_id, created_at) satisfies the FK.
            $table->dropIndex(['user_id']);
        });
    }

    public function down(): void
    {
        Schema::table('service_submissions', function (Blueprint $table): void {
            $table->index('user_id');
        });

        Schema::table('service_submissions', function (Blueprint $table): void {
            $table->dropIndex('submissions_user_created_idx');
        });
    }
};
