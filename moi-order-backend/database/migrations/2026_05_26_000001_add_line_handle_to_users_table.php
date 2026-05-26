<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds line_handle — the user-supplied LINE ID (e.g. "chrisline"), not the
 * OAuth sub. Nullable because it is self-reported and entirely optional.
 * Unique because two accounts must not claim the same LINE handle.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('line_handle', 50)->nullable()->unique()->after('line_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['line_handle']);
            $table->dropColumn('line_handle');
        });
    }
};
