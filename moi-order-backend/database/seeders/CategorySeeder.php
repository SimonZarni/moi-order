<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name_my' => 'စားသောက်ဆိုင်',    'name_en' => 'Restaurant',   'name_th' => 'ร้านอาหาร',             'slug' => 'restaurant'],
            ['name_my' => 'နေရာဆိုင်ရာ',       'name_en' => 'Attraction',   'name_th' => 'สถานที่ท่องเที่ยว',     'slug' => 'attraction'],
            ['name_my' => 'ဈေးများ',            'name_en' => 'Market',       'name_th' => 'ตลาด',                  'slug' => 'market'],
            ['name_my' => 'ဘုရားကျောင်းများ',  'name_en' => 'Temple',       'name_th' => 'วัด',                   'slug' => 'temple'],
            ['name_my' => 'ဟိုတယ်များ',        'name_en' => 'Hotel',        'name_th' => 'โรงแรม',               'slug' => 'hotel'],
        ];

        foreach ($categories as $data) {
            Category::create($data);
        }
    }
}
