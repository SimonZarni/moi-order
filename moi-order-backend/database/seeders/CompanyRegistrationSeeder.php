<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanyRegistrationSeeder extends Seeder
{
    public function run(): void
    {
        $serviceId = DB::table('services')->insertGetId([
            'name'       => 'จดทะเบียนบริษัท',
            'name_en'    => 'Company Registration',
            'name_mm'    => 'ကုမ္ပဏီလိုင်စင် လျှောက်ထားရန်',
            'slug'       => 'company-registration',
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('service_types')->insert([
            'service_id' => $serviceId,
            'name'       => 'มาตรฐาน',
            'name_en'    => 'Standard',
            'name_mm'    => 'အခြေခံ၀န်ဆောင်မှု',
            'price'      => 45000,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
