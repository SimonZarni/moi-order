<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmbassyVisaRecommendationSeeder extends Seeder
{
    public function run(): void
    {
        $serviceId = DB::table('services')->insertGetId([
            'name'       => 'หนังสือแนะนำวีซ่าสถานทูต',
            'name_en'    => 'Embassy Visa Recommendation Letter',
            'name_mm'    => 'ဗီဇာ သက်တမ်းတိုးရန်ထောက်ခံစာ',
            'slug'       => 'embassy-visa-recommendation',
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
