<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmbassyCarLicenseSeeder extends Seeder
{
    public function run(): void
    {
        $serviceId = DB::table('services')->insertGetId([
            'name'       => 'บริการใบขับขี่สถานทูต',
            'name_en'    => 'Embassy Car License',
            'name_mm'    => 'ကားလိုင်စင်ထောက်ခံစာ',
            'slug'       => 'embassy-car-license',
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('service_types')->insert([
            'service_id' => $serviceId,
            'name'       => 'มาตรฐาน',
            'name_en'    => 'Standard',
            'name_mm'    => 'အခြေခံ၀န်ဆောင်မှု',
            'price'      => 350,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
