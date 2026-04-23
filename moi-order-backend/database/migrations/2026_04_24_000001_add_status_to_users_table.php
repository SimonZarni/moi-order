<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('status', 20)
                ->default('active')
                ->after('is_admin');

            $table->index('status');
        });

        // Must run after Schema::table() — Blueprint defers its ALTER TABLE until
        // the callback returns, so DB::statement() inside the callback fires first
        // and MySQL cannot find the column yet.
        DB::statement("ALTER TABLE users ADD CONSTRAINT chk_users_status CHECK (status IN ('active','suspended','banned'))");
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropIndex(['status']);
            $table->dropColumn('status');
        });

        // CHECK constraints are dropped automatically with the column in MySQL 8+.
    }
};
