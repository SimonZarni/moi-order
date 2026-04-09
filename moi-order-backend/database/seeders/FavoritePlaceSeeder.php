<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\FavoritePlace;
use App\Models\Place;
use App\Models\User;
use Illuminate\Database\Seeder;

class FavoritePlaceSeeder extends Seeder
{
    public function run(): void
    {
        $user   = User::first();
        $places = Place::take(3)->get();

        foreach ($places as $place) {
            FavoritePlace::create([
                'user_id'    => $user->id,
                'place_id'   => $place->id,
                'created_at' => now(),
            ]);
        }
    }
}
