<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $serviceId = DB::table('services')->insertGetId([
            'name'       => 'รายงานตัว 90 วัน',
            'name_en'    => '90-Day Report',
            'name_mm'    => 'ရက် ၉၀ တုံး',
            'slug'       => '90-day-report',
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('service_types')->insert([
            [
                'service_id' => $serviceId,
                'name'       => 'ทั่วไป',
                'name_en'    => 'Default',
                'name_mm'    => 'ရက် ၉၀ တုံး',
                'price'      => 150,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'service_id' => $serviceId,
                'name'       => 'วีซ่าใหญ่',
                'name_en'    => 'Big Visa',
                'name_mm'    => 'ရက် ၉၀ တုံး (Visa အကြီး)',
                'price'      => 1000,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'service_id' => $serviceId,
                'name'       => 'วีซ่าใหญ่/ภูมิภาค',
                'name_en'    => 'Big Visa / Region',
                'name_mm'    => 'ရက် ၉၀ တုံး (Visa အကြီး | နယ်)',
                'price'      => 1150,
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
