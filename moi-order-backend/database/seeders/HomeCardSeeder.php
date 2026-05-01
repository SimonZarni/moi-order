<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\HomeCardIconKey;
use App\Enums\HomeCardNavigationScreen;
use App\Models\HomeCard;
use Illuminate\Database\Seeder;

class HomeCardSeeder extends Seeder
{
    public function run(): void
    {
        $cards = [
            [
                'slug'              => 'ninety-day-report',
                'position'          => 1,
                'title_en'          => '90-Day Report',
                'title_mm'          => 'ရက် ၉၀ တုံး',
                'subtitle_en'       => null,
                'subtitle_mm'       => null,
                'tag_en'            => 'Immigration',
                'tag_mm'            => 'လဝကသို့',
                'accent_color'      => '#52796f',
                'icon_key'          => HomeCardIconKey::Calendar->value,
                'navigation_screen' => HomeCardNavigationScreen::NinetyDayReport->value,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
            ],
            [
                'slug'              => 'places-and-tickets',
                'position'          => 2,
                'title_en'          => 'Places & Tickets',
                'title_mm'          => 'နေရာများ & လက်မှတ်',
                'subtitle_en'       => 'Attractions & Landmarks',
                'subtitle_mm'       => 'လည်ပတ်စရာများနှင့် ထင်ရှားသောနေရာများ',
                'tag_en'            => 'Explore',
                'tag_mm'            => 'လေ့လာရန်',
                'accent_color'      => '#b08d57',
                'icon_key'          => HomeCardIconKey::Location->value,
                'navigation_screen' => HomeCardNavigationScreen::Places->value,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
            ],
            [
                'slug'              => 'other-services',
                'position'          => 3,
                'title_en'          => 'Other Services',
                'title_mm'          => 'အခြား၀န်ဆောင်မှုများ',
                'subtitle_en'       => 'Company & more',
                'subtitle_mm'       => 'ကုမ္ပဏီနှင့် အခြားအချက်အလက်များ',
                'tag_en'            => 'Registration',
                'tag_mm'            => 'မှတ်ပုံတင်ရန်',
                'accent_color'      => '#6b9e94',
                'icon_key'          => HomeCardIconKey::Flash->value,
                'navigation_screen' => HomeCardNavigationScreen::OtherServices->value,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
            ],
            [
                'slug'              => 'embassy-services',
                'position'          => 4,
                'title_en'          => 'သံရုံးထောက်ခံစာများ',
                'title_mm'          => 'သံရုံးထောက်ခံစာများ',
                'subtitle_en'       => 'Support letters & more',
                'subtitle_mm'       => 'ထောက်ခံစာများနှင့် အခြားကဏ္ဍများ',
                'tag_en'            => 'Embassy',
                'tag_mm'            => 'သံရုံး',
                'accent_color'      => '#8b4353',
                'icon_key'          => HomeCardIconKey::Embassy->value,
                'navigation_screen' => HomeCardNavigationScreen::EmbassyServices->value,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
            ],
            [
                'slug'              => 'airport-fast-track',
                'position'          => 5,
                'title_en'          => 'Airport Fast Track',
                'title_mm'          => 'Airport Fast Track',
                'subtitle_en'       => 'Priority airport service',
                'subtitle_mm'       => 'လေဆိပ် အထူး၀န်ဆောင်မှု',
                'tag_en'            => 'Travel',
                'tag_mm'            => 'ခရီးသွား',
                'accent_color'      => '#4a7fa5',
                'icon_key'          => HomeCardIconKey::Airport->value,
                'navigation_screen' => HomeCardNavigationScreen::AirportFastTrack->value,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
            ],
            [
                'slug'              => 'bus-tickets',
                'position'          => 6,
                'title_en'          => 'ကားလက်မှတ်များ',
                'title_mm'          => 'ကားလက်မှတ်များ',
                'subtitle_en'       => 'Routes & schedules',
                'subtitle_mm'       => 'ကားလိုင်းများနှင့် အချိန်ဇယားများ',
                'tag_en'            => 'Transport',
                'tag_mm'            => 'သယ်ယူပို့ဆောင်ရေး',
                'accent_color'      => '#1e3d6b',
                'icon_key'          => HomeCardIconKey::Bus->value,
                'navigation_screen' => HomeCardNavigationScreen::Search->value,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => true,
            ],
            [
                'slug'              => 'passport-ci',
                'position'          => 7,
                'title_en'          => 'Passport / CI',
                'title_mm'          => 'Passport / CI',
                'subtitle_en'       => 'Document services',
                'subtitle_mm'       => 'Document services',
                'tag_en'            => 'Documents',
                'tag_mm'            => 'စာရွက်စာတမ်းများ',
                'accent_color'      => '#5c5a8a',
                'icon_key'          => HomeCardIconKey::Passport->value,
                'navigation_screen' => HomeCardNavigationScreen::PassportVault->value,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => true,
            ],
            [
                'slug'              => 'food-ordering',
                'position'          => 8,
                'title_en'          => 'အစားအသောက်မှာယူရန်',
                'title_mm'          => 'အစားအသောက်မှာယူရန်',
                'subtitle_en'       => 'Food delivery',
                'subtitle_mm'       => 'အစားအသောက် ပို့ဆောင်ရေး',
                'tag_en'            => 'Food',
                'tag_mm'            => 'အစားအသောက်',
                'accent_color'      => '#b85c45',
                'icon_key'          => HomeCardIconKey::Food->value,
                'navigation_screen' => HomeCardNavigationScreen::Food->value,
                'navigation_params' => null,
                'is_active'         => true,
                'is_coming_soon'    => false,
            ],
        ];

        foreach ($cards as $card) {
            HomeCard::updateOrCreate(['slug' => $card['slug']], $card);
        }
    }
}
