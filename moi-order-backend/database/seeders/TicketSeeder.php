<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $ticketId = DB::table('tickets')->insertGetId([
            'name'                  => 'Dream World',
            'highlight_description' => 'Experience the magic of Thailand\'s premier theme park with thrilling rides and live shows.',
            'description'           => 'Dream World is one of Thailand\'s most popular theme parks, featuring exciting rides, fantasy lands, and world-class entertainment. Enjoy roller coasters, water rides, a snow town experience, and spectacular live shows suitable for all ages. Located just north of Bangkok, it offers a full day of family fun in a beautifully themed environment.',
            'google_maps_link'      => 'https://maps.google.com/?q=Dream+World+Bangkok',
            'address'               => '62 Moo 1, Rangsit-Nakhon Nayok Road',
            'city'                  => 'Pathum Thani',
            'province'              => 'Pathum Thani',
            'cover_image_path'      => 'placeholders/dream-world-cover.jpg',
            'is_active'             => true,
            'sort_order'            => 0,
            'created_at'            => now(),
            'updated_at'            => now(),
        ]);

        DB::table('ticket_variants')->insert([
            [
                'ticket_id'   => $ticketId,
                'name'        => 'Dream World Starter Package',
                'description' => 'Entry ticket with access to all standard rides and attractions.',
                'price'       => 700,
                'is_active'   => true,
                'sort_order'  => 0,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'ticket_id'   => $ticketId,
                'name'        => 'Dream World Full Package',
                'description' => 'All-inclusive ticket with unlimited access to all rides, shows, and Snow Town.',
                'price'       => 1000,
                'is_active'   => true,
                'sort_order'  => 1,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
