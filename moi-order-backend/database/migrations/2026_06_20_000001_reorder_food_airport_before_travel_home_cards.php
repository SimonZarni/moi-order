<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $now = now();

            // Desired root order: documents(1) → food-ordering(2) → airport-fast-track(3) → travel(4)
            // All other cards keep their existing positions (5+).
            DB::table('home_cards')
                ->where('slug', 'food-ordering')
                ->update(['position' => 2, 'updated_at' => $now]);

            DB::table('home_cards')
                ->where('slug', 'airport-fast-track')
                ->update(['position' => 3, 'updated_at' => $now]);

            DB::table('home_cards')
                ->where('slug', 'travel')
                ->update(['position' => 4, 'updated_at' => $now]);
        });

        try { Cache::forget('home_cards:visible'); } catch (\Throwable) {}
    }

    public function down(): void
    {
        DB::transaction(function (): void {
            $now = now();

            // Restore original positions: travel(2), food-ordering(3), airport-fast-track(4)
            DB::table('home_cards')
                ->where('slug', 'travel')
                ->update(['position' => 2, 'updated_at' => $now]);

            DB::table('home_cards')
                ->where('slug', 'food-ordering')
                ->update(['position' => 3, 'updated_at' => $now]);

            DB::table('home_cards')
                ->where('slug', 'airport-fast-track')
                ->update(['position' => 4, 'updated_at' => $now]);
        });

        try { Cache::forget('home_cards:visible'); } catch (\Throwable) {}
    }
};
