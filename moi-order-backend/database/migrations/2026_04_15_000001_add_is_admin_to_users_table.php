<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds is_admin flag to users.
 * Security: defaults to false — existing users are never accidentally promoted.
 * Index added because AdminAuthenticate middleware reads this column on every admin request.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->boolean('is_admin')->default(false)->after('password');
            $table->index('is_admin');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropIndex(['is_admin']);
            $table->dropColumn('is_admin');
        });
    }
};
