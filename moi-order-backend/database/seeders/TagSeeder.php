<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            ['name_my' => 'အခမဲ့ဝင်ရောက်',       'name_en' => 'Free Entry',       'name_th' => 'เข้าฟรี',                    'slug' => 'free-entry'],
            ['name_my' => 'မိသားစုနှင့်သင့်တော်', 'name_en' => 'Family Friendly',  'name_th' => 'เหมาะสำหรับครอบครัว',       'slug' => 'family-friendly'],
            ['name_my' => 'အပြင်ထွက်',            'name_en' => 'Outdoor',          'name_th' => 'กลางแจ้ง',                   'slug' => 'outdoor'],
            ['name_my' => 'အတွင်းပိုင်း',         'name_en' => 'Indoor',           'name_th' => 'ในร่ม',                      'slug' => 'indoor'],
            ['name_my' => 'ညအချိန်',              'name_en' => 'Nightlife',        'name_th' => 'กลางคืน',                    'slug' => 'nightlife'],
            ['name_my' => 'ရေကူး',                'name_en' => 'Swimming',         'name_th' => 'ว่ายน้ำ',                    'slug' => 'swimming'],
            ['name_my' => 'ဓာတ်ပုံရိုက်',         'name_en' => 'Photography',      'name_th' => 'ถ่ายรูป',                    'slug' => 'photography'],
            ['name_my' => 'စျေးသင့်',             'name_en' => 'Budget',           'name_th' => 'ราคาประหยัด',                'slug' => 'budget'],
        ];

        foreach ($tags as $data) {
            Tag::create($data);
        }
    }
}
