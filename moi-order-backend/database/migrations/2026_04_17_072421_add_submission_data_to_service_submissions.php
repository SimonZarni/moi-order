<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('service_submissions', function (Blueprint $table): void {
            $table->json('submission_data')->nullable()->after('idempotency_key');
        });
    }

    public function down(): void
    {
        Schema::table('service_submissions', function (Blueprint $table): void {
            $table->dropColumn('submission_data');
        });
    }
};
