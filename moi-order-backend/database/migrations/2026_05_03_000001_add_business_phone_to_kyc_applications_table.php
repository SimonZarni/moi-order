<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kyc_applications', function (Blueprint $table): void {
            $table->string('business_phone', 50)->nullable()->after('business_address');
        });
    }

    public function down(): void
    {
        Schema::table('kyc_applications', function (Blueprint $table): void {
            $table->dropColumn('business_phone');
        });
    }
};
