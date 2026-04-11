<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmbassyBankSeeder extends Seeder
{
    public function run(): void
    {
        $serviceId = DB::table('services')->insertGetId([
            'name'       => 'บริการธนาคารสถานทูต',
            'name_en'    => 'Embassy Bank Service',
            'slug'       => 'embassy-bank-service',
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('service_types')->insert([
            'service_id' => $serviceId,
            'name'       => 'มาตรฐาน',
            'name_en'    => 'Standard',
            'price'      => 350,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
