<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\HomeCardIconType;
use App\Models\HomeCardIcon;
use Illuminate\Database\Seeder;

class HomeCardIconSeeder extends Seeder
{
    public function run(): void
    {
        $icons = [
            ['key' => 'calendar', 'label' => 'Calendar'],
            ['key' => 'location', 'label' => 'Location'],
            ['key' => 'flash',    'label' => 'Flash'],
            ['key' => 'embassy',  'label' => 'Embassy'],
            ['key' => 'airport',  'label' => 'Airport'],
            ['key' => 'bus',      'label' => 'Bus'],
            ['key' => 'passport', 'label' => 'Passport'],
            ['key' => 'food',     'label' => 'Food'],
            ['key' => 'ticket',   'label' => 'Ticket'],
            ['key' => 'company',  'label' => 'Company'],
        ];

        foreach ($icons as $icon) {
            HomeCardIcon::firstOrCreate(
                ['key' => $icon['key']],
                [
                    'label'      => $icon['label'],
                    'type'       => HomeCardIconType::Builtin,
                    'image_path' => null,
                    'is_active'  => true,
                ]
            );
        }
    }
}
