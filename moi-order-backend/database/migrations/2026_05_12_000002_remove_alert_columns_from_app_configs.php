<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('app_configs', static function (Blueprint $table): void {
            $table->dropColumn(['alert_is_active', 'alert_title', 'alert_message', 'alert_frequency']);
        });
    }

    public function down(): void
    {
        Schema::table('app_configs', static function (Blueprint $table): void {
            $table->boolean('alert_is_active')->default(false)->after('android_store_url');
            $table->string('alert_title', 255)->nullable()->after('alert_is_active');
            $table->string('alert_message', 1000)->nullable()->after('alert_title');
            $table->string('alert_frequency', 20)->default('once_per_day')->after('alert_message');
        });
    }
};
