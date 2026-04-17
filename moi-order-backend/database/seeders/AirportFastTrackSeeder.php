<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AirportFastTrackSeeder extends Seeder
{
    public function run(): void
    {
        $serviceId = DB::table('services')->insertGetId([
            'name'       => 'ฟาสแทร็กสนามบิน',
            'name_en'    => 'Airport Fast Track',
            'name_mm'    => 'လေဆိပ် Fast Track',
            'slug'       => 'airport-fast-track',
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('service_types')->insert([
            'service_id' => $serviceId,
            'name'       => 'มาตรฐาน',
            'name_en'    => 'Standard',
            'name_mm'    => 'အခြေခံ၀န်ဆောင်မှု',
            'price'      => 3000,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
