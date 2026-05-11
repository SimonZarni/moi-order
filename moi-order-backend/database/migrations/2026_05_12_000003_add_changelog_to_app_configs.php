<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('app_configs', function (Blueprint $table): void {
            $table->string('next_version', 20)->nullable()->after('android_store_url');
            $table->json('changelog')->nullable()->after('next_version');
        });
    }

    public function down(): void
    {
        Schema::table('app_configs', function (Blueprint $table): void {
            $table->dropColumn(['next_version', 'changelog']);
        });
    }
};
