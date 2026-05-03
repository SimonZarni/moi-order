<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('home_card_routes')->insertOrIgnore([
            'key'        => 'CompanyServices',
            'label_en'   => 'Company Services',
            'label_mm'   => 'ကုမ္ပဏီ ဝန်ဆောင်မှုများ',
            'type'       => 'internal',
            'url'        => null,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('home_card_routes')->where('key', 'CompanyServices')->delete();
    }
};
