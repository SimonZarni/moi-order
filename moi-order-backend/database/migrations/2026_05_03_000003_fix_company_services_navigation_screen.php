<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('home_cards')
            ->where('slug', 'company-services')
            ->update(['navigation_screen' => 'CompanyServices']);
    }

    public function down(): void
    {
        DB::table('home_cards')
            ->where('slug', 'company-services')
            ->update(['navigation_screen' => 'OtherServices']);
    }
};
