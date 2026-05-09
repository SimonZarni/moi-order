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
            // 'initial' = first-time KYC. 'resubmission' = name/address change request.
            $table->string('type', 50)->default('initial')->after('user_id');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::table('kyc_applications', function (Blueprint $table): void {
            $table->dropIndex(['type']);
            $table->dropColumn('type');
        });
    }
};
