<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket_variants', function (Blueprint $table): void {
            $table->dropIndex(['available_quantity']);
            $table->dropColumn('available_quantity');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_variants', function (Blueprint $table): void {
            $table->unsignedBigInteger('available_quantity')->default(0)->after('is_active');
            $table->index('available_quantity');
        });
    }
};
