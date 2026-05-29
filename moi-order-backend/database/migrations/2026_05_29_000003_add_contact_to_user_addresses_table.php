<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_addresses', function (Blueprint $table): void {
            $table->string('contact_name', 255)->nullable()->after('province');
            $table->string('contact_phone', 50)->nullable()->after('contact_name');
        });
    }

    public function down(): void
    {
        Schema::table('user_addresses', function (Blueprint $table): void {
            $table->dropColumn(['contact_name', 'contact_phone']);
        });
    }
};
