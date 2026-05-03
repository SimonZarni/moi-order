<?php

declare(strict_types=1);

use App\Enums\HomeCardIconType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('home_card_icons')->insertOrIgnore([
            'key'        => 'company',
            'label'      => 'Company',
            'type'       => HomeCardIconType::Builtin->value,
            'image_path' => null,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('home_card_icons')->where('key', 'company')->delete();
    }
};
