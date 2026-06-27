<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Retire the generic SafetyLocationList route
        DB::table('home_card_routes')
            ->where('key', 'SafetyLocationList')
            ->whereNull('deleted_at')
            ->update(['deleted_at' => now()]);

        $routes = [
            ['key' => 'HospitalList',      'label_en' => 'Hospital List',       'label_mm' => 'ဆေးရုံများ'],
            ['key' => 'PoliceStationList',  'label_en' => 'Police Station List', 'label_mm' => 'ရဲစခန်းများ'],
            ['key' => 'RescueTeamList',     'label_en' => 'Rescue Team List',    'label_mm' => 'ကယ်ဆယ်ရေးအဖွဲ့များ'],
        ];

        DB::table('home_card_routes')->upsert(
            array_map(fn ($r) => array_merge($r, [
                'type'       => 'internal',
                'url'        => null,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]), $routes),
            ['key'],
            ['label_en', 'label_mm', 'type', 'is_active', 'updated_at', 'deleted_at']
        );
    }

    public function down(): void
    {
        DB::table('home_card_routes')
            ->whereIn('key', ['HospitalList', 'PoliceStationList', 'RescueTeamList'])
            ->update(['deleted_at' => now()]);

        DB::table('home_card_routes')
            ->where('key', 'SafetyLocationList')
            ->update(['deleted_at' => null]);
    }
};
