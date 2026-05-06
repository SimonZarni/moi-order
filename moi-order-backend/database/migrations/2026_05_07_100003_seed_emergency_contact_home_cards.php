<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $now = now();

            // ── 1. Seed HomeCardRoute for the list screen ─────────────────────
            DB::table('home_card_routes')->insertOrIgnore([
                'key'        => 'EmergencyContactList',
                'type'       => 'internal',
                'label_en'   => 'Emergency Contact List',
                'label_mm'   => 'အရေးပေါ်ဆက်သွယ်ရေး',
                'is_active'  => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // ── 2. Insert Emergency parent card ───────────────────────────────
            $position = (int) DB::table('home_cards')
                ->whereNull('parent_id')
                ->whereNull('deleted_at')
                ->max('position') + 1;

            $emergencyId = DB::table('home_cards')->insertGetId([
                'slug'              => 'emergency',
                'position'          => $position,
                'title_en'          => 'Emergency',
                'title_mm'          => 'အရေးပေါ်',
                'subtitle_en'       => 'Hospitals, police & rescue',
                'subtitle_mm'       => 'ဆေးရုံ၊ ရဲနှင့် ကယ်ဆယ်ရေး',
                'tag_en'            => 'SAFETY',
                'tag_mm'            => 'လုံခြုံရေး',
                'accent_color'      => '#c0392b',
                'icon_key'          => 'flash',
                'navigation_screen' => null,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
                'created_at'        => $now,
                'updated_at'        => $now,
            ]);

            // ── 3. Insert three child tiles ───────────────────────────────────
            DB::table('home_cards')->insert([
                [
                    'parent_id'         => $emergencyId,
                    'slug'              => 'emergency-hospitals',
                    'position'          => 1,
                    'title_en'          => 'Hospitals',
                    'title_mm'          => 'ဆေးရုံများ',
                    'subtitle_en'       => null,
                    'subtitle_mm'       => null,
                    'tag_en'            => 'Medical',
                    'tag_mm'            => 'ဆေးပညာ',
                    'accent_color'      => '#c0392b',
                    'icon_key'          => 'flash',
                    'navigation_screen' => 'EmergencyContactList',
                    'navigation_params' => json_encode(['type' => 'hospital']),
                    'is_active'         => true,
                    'is_coming_soon'    => false,
                    'created_at'        => $now,
                    'updated_at'        => $now,
                ],
                [
                    'parent_id'         => $emergencyId,
                    'slug'              => 'emergency-police',
                    'position'          => 2,
                    'title_en'          => 'Police Stations',
                    'title_mm'          => 'ရဲစခန်းများ',
                    'subtitle_en'       => null,
                    'subtitle_mm'       => null,
                    'tag_en'            => 'Safety',
                    'tag_mm'            => 'လုံခြုံရေး',
                    'accent_color'      => '#2471a3',
                    'icon_key'          => 'flash',
                    'navigation_screen' => 'EmergencyContactList',
                    'navigation_params' => json_encode(['type' => 'police_station']),
                    'is_active'         => true,
                    'is_coming_soon'    => false,
                    'created_at'        => $now,
                    'updated_at'        => $now,
                ],
                [
                    'parent_id'         => $emergencyId,
                    'slug'              => 'emergency-rescue',
                    'position'          => 3,
                    'title_en'          => 'Rescues',
                    'title_mm'          => 'ကယ်ဆယ်ရေး',
                    'subtitle_en'       => null,
                    'subtitle_mm'       => null,
                    'tag_en'            => 'Rescue',
                    'tag_mm'            => 'ကယ်ဆယ်ရေး',
                    'accent_color'      => '#1e8449',
                    'icon_key'          => 'flash',
                    'navigation_screen' => 'EmergencyContactList',
                    'navigation_params' => json_encode(['type' => 'rescue']),
                    'is_active'         => true,
                    'is_coming_soon'    => false,
                    'created_at'        => $now,
                    'updated_at'        => $now,
                ],
            ]);
        });
    }

    public function down(): void
    {
        DB::transaction(function (): void {
            DB::table('home_cards')->whereIn('slug', [
                'emergency-hospitals',
                'emergency-police',
                'emergency-rescue',
                'emergency',
            ])->delete();

            DB::table('home_card_routes')
                ->where('key', 'EmergencyContactList')
                ->delete();
        });
    }
};
