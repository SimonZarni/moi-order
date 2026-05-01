<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\HomeCardRouteType;
use App\Models\HomeCardRoute;
use Illuminate\Database\Seeder;

class HomeCardRouteSeeder extends Seeder
{
    public function run(): void
    {
        $routes = [
            ['key' => 'NinetyDayReport',  'label_en' => '90-Day Report',      'label_mm' => '90 ရက် အစီရင်ခံစာ'],
            ['key' => 'Places',           'label_en' => 'Places',              'label_mm' => 'နေရာများ'],
            ['key' => 'Tickets',          'label_en' => 'Tickets',             'label_mm' => 'လက်မှတ်များ'],
            ['key' => 'OtherServices',    'label_en' => 'Other Services',      'label_mm' => 'အခြားဝန်ဆောင်မှုများ'],
            ['key' => 'EmbassyServices',  'label_en' => 'Embassy Services',    'label_mm' => 'သံရုံးဝန်ဆောင်မှုများ'],
            ['key' => 'AirportFastTrack', 'label_en' => 'Airport Fast Track',  'label_mm' => 'လေဆိပ် Fast Track'],
            ['key' => 'Food',             'label_en' => 'Food',                'label_mm' => 'အစားအသောက်'],
            ['key' => 'PassportVault',    'label_en' => 'Passport Vault',      'label_mm' => 'နိုင်ငံကူး လျှောက်လွှာ'],
            ['key' => 'Search',           'label_en' => 'Search',              'label_mm' => 'ရှာဖွေရန်'],
            ['key' => 'PlacesMap',        'label_en' => 'Places Map',          'label_mm' => 'နေရာမြေပုံ'],
        ];

        foreach ($routes as $route) {
            HomeCardRoute::firstOrCreate(
                ['key' => $route['key']],
                [
                    'label_en'  => $route['label_en'],
                    'label_mm'  => $route['label_mm'],
                    'type'      => HomeCardRouteType::Internal,
                    'url'       => null,
                    'is_active' => true,
                ]
            );
        }
    }
}
