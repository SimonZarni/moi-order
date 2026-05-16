<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add build-level version gating to app_configs.
 *
 * Why: version strings alone (e.g. "2.0.0") are insufficient when multiple native
 * builds share the same marketing version. iOS Build Number and Android versionCode
 * are the definitive identifiers for a specific binary. Adding these allows admins
 * to gate "2.0.0 Build 1" users without affecting "2.0.0 Build 2" users.
 *
 * nullable: existing rows keep null (= no build-level gate, version-string gate only).
 * unsignedInteger: build numbers are always non-negative integers.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('app_configs', static function (Blueprint $table): void {
            $table->unsignedInteger('ios_min_build')->nullable()->after('ios_min_version');
            $table->unsignedInteger('android_min_code')->nullable()->after('android_min_version');
        });
    }

    public function down(): void
    {
        Schema::table('app_configs', static function (Blueprint $table): void {
            $table->dropColumn(['ios_min_build', 'android_min_code']);
        });
    }
};
