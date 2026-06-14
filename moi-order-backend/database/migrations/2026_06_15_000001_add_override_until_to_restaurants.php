<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table): void {
            // Stores when the merchant's manual status override expires.
            // While now() < override_until: use the stored status column.
            // After expiry: status is computed from opening hours (lazy, on read).
            $table->timestamp('override_until')->nullable()->after('status');
            $table->index('override_until');
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table): void {
            $table->dropIndex(['override_until']);
            $table->dropColumn('override_until');
        });
    }
};
