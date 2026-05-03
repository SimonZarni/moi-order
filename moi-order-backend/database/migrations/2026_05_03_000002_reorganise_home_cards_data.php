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

            // ── 1. Insert Documents parent card ───────────────────────────────
            $documentsId = DB::table('home_cards')->insertGetId([
                'slug'              => 'documents',
                'position'          => 1,
                'title_en'          => 'Documents',
                'title_mm'          => 'စာရွက်စာတမ်းများ',
                'subtitle_en'       => 'Official & consular services',
                'subtitle_mm'       => 'တရားဝင်နှင့် သံတမန်ဝန်ဆောင်မှုများ',
                'tag_en'            => 'VISA & IDs',
                'tag_mm'            => 'ဗီဇာနှင့် ID',
                'accent_color'      => '#5c5a8a',
                'icon_key'          => 'passport',
                'navigation_screen' => null,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
                'created_at'        => $now,
                'updated_at'        => $now,
            ]);

            // ── 2. Insert Travel parent card ──────────────────────────────────
            $travelId = DB::table('home_cards')->insertGetId([
                'slug'              => 'travel',
                'position'          => 2,
                'title_en'          => 'Travel',
                'title_mm'          => 'ခရီးသွားလာရေး',
                'subtitle_en'       => 'Places, tickets & buses',
                'subtitle_mm'       => 'နေရာများ၊ လက်မှတ်နှင့် ကားဝန်ဆောင်မှု',
                'tag_en'            => 'TRANSPORT',
                'tag_mm'            => 'သယ်ယူပို့ဆောင်ရေး',
                'accent_color'      => '#b08d57',
                'icon_key'          => 'location',
                'navigation_screen' => null,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
                'created_at'        => $now,
                'updated_at'        => $now,
            ]);

            // ── 3. Insert Company Services root card ──────────────────────────
            DB::table('home_cards')->insert([
                'slug'              => 'company-services',
                'position'          => 5,
                'title_en'          => 'Company Services',
                'title_mm'          => 'ကုမ္ပဏီဝန်ဆောင်မှုများ',
                'subtitle_en'       => 'Registration & more',
                'subtitle_mm'       => 'မှတ်ပုံတင်ရန်နှင့် အခြားများ',
                'tag_en'            => 'BUSINESS',
                'tag_mm'            => 'စီးပွားရေး',
                'accent_color'      => '#1e3d6b',
                'icon_key'          => 'company',
                'navigation_screen' => 'OtherServices',
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
                'created_at'        => $now,
                'updated_at'        => $now,
            ]);

            // ── 4. Insert Tickets child card (under Travel) ───────────────────
            DB::table('home_cards')->insert([
                'parent_id'         => $travelId,
                'slug'              => 'tickets',
                'position'          => 2,
                'title_en'          => 'Tickets',
                'title_mm'          => 'လက်မှတ်',
                'subtitle_en'       => null,
                'subtitle_mm'       => null,
                'tag_en'            => 'Events',
                'tag_mm'            => 'ပွဲများ',
                'accent_color'      => '#64748b',
                'icon_key'          => 'ticket',
                'navigation_screen' => 'Tickets',
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
                'created_at'        => $now,
                'updated_at'        => $now,
            ]);

            // ── 5. Documents children ─────────────────────────────────────────
            DB::table('home_cards')->where('slug', 'ninety-day-report')
                ->update(['parent_id' => $documentsId, 'position' => 1, 'updated_at' => $now]);

            DB::table('home_cards')->where('slug', 'passport-ci')
                ->update(['parent_id' => $documentsId, 'position' => 2, 'updated_at' => $now]);

            DB::table('home_cards')->where('slug', 'embassy-services')
                ->update(['parent_id' => $documentsId, 'position' => 3, 'updated_at' => $now]);

            // ── 6. Travel children ────────────────────────────────────────────
            // Rename places-and-tickets → places (first Travel child)
            DB::table('home_cards')->where('slug', 'places-and-tickets')
                ->update([
                    'parent_id'         => $travelId,
                    'position'          => 1,
                    'slug'              => 'places',
                    'title_en'          => 'Places',
                    'title_mm'          => 'နေရာများ',
                    'subtitle_en'       => null,
                    'subtitle_mm'       => null,
                    'updated_at'        => $now,
                ]);

            DB::table('home_cards')->where('slug', 'bus-tickets')
                ->update(['parent_id' => $travelId, 'position' => 3, 'updated_at' => $now]);

            // ── 7. Root card positions ────────────────────────────────────────
            DB::table('home_cards')->where('slug', 'food-ordering')
                ->update(['position' => 3, 'updated_at' => $now]);

            DB::table('home_cards')->where('slug', 'airport-fast-track')
                ->update(['position' => 4, 'updated_at' => $now]);

            DB::table('home_cards')->where('slug', 'other-services')
                ->update([
                    'position'    => 6,
                    'subtitle_en' => 'Miscellaneous services',
                    'subtitle_mm' => 'အခြားဝန်ဆောင်မှုများ',
                    'updated_at'  => $now,
                ]);
        });
    }

    public function down(): void
    {
        DB::transaction(function (): void {
            $now = now();

            // Step 1: clear parent_id from all children and restore their original state
            DB::table('home_cards')->where('slug', 'ninety-day-report')
                ->update(['parent_id' => null, 'position' => 1, 'updated_at' => $now]);

            DB::table('home_cards')->where('slug', 'passport-ci')
                ->update(['parent_id' => null, 'position' => 7, 'updated_at' => $now]);

            DB::table('home_cards')->where('slug', 'embassy-services')
                ->update(['parent_id' => null, 'position' => 4, 'updated_at' => $now]);

            DB::table('home_cards')->where('slug', 'places')
                ->update([
                    'parent_id'   => null,
                    'position'    => 2,
                    'slug'        => 'places-and-tickets',
                    'title_en'    => 'Places & Tickets',
                    'title_mm'    => 'နေရာများ & လက်မှတ်',
                    'subtitle_en' => 'Attractions & Landmarks',
                    'subtitle_mm' => 'လည်ပတ်စရာများနှင့် ထင်ရှားသောနေရာများ',
                    'updated_at'  => $now,
                ]);

            DB::table('home_cards')->where('slug', 'bus-tickets')
                ->update(['parent_id' => null, 'position' => 6, 'updated_at' => $now]);

            // Step 2: restore root card positions
            DB::table('home_cards')->where('slug', 'food-ordering')
                ->update(['position' => 8, 'updated_at' => $now]);

            DB::table('home_cards')->where('slug', 'airport-fast-track')
                ->update(['position' => 5, 'updated_at' => $now]);

            DB::table('home_cards')->where('slug', 'other-services')
                ->update([
                    'position'    => 3,
                    'subtitle_en' => 'Company & more',
                    'subtitle_mm' => 'ကုမ္ပဏီနှင့် အခြားအချက်အလက်များ',
                    'updated_at'  => $now,
                ]);

            // Step 3: delete inserted records (children have null parent_id so FK is satisfied)
            DB::table('home_cards')
                ->whereIn('slug', ['documents', 'travel', 'tickets', 'company-services'])
                ->delete();
        });
    }
};
