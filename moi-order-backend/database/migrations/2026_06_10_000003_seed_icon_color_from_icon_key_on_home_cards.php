<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /** Original hardcoded colours per builtin icon key. */
    private const ICON_COLORS = [
        'calendar' => '#52796f',
        'ticket'   => '#64748b',
        'location' => '#b08d57',
        'passport' => '#5c5a8a',
        'food'     => '#b85c45',
        'airport'  => '#4a7fa5',
        'embassy'  => '#8b4353',
        'bus'      => '#1e3d6b',
        'flash'    => '#6b9e94',
        'company'  => '#1e3d6b',
    ];

    public function up(): void
    {
        foreach (self::ICON_COLORS as $iconKey => $color) {
            DB::table('home_cards')
                ->where('icon_key', $iconKey)
                ->update(['icon_color' => $color]);
        }
    }

    public function down(): void
    {
        DB::table('home_cards')->update(['icon_color' => '#52796f']);
    }
};
