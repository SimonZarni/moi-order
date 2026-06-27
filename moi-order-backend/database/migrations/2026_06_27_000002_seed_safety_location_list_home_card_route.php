<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Soft-delete any incorrectly-keyed safety routes (e.g. 'safety-location-list')
        DB::table('home_card_routes')
            ->where('key', 'like', 'safety%')
            ->whereNull('deleted_at')
            ->update(['deleted_at' => now()]);

        // Upsert the correct PascalCase key that the mobile switch matches
        DB::table('home_card_routes')->upsert(
            [
                [
                    'key'        => 'SafetyLocationList',
                    'label_en'   => 'Safety Location List',
                    'label_mm'   => 'ဘေးအန္တရာယ် နေရာများ',
                    'type'       => 'internal',
                    'url'        => null,
                    'is_active'  => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ],
            ['key'],
            ['label_en', 'label_mm', 'type', 'is_active', 'updated_at', 'deleted_at']
        );
    }

    public function down(): void
    {
        DB::table('home_card_routes')
            ->where('key', 'SafetyLocationList')
            ->update(['deleted_at' => now()]);
    }
};
