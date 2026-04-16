<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $name = fake()->words(2, true);

        return [
            'name'      => $name,
            'name_en'   => $name,
            'slug'      => Str::slug($name).'-'.Str::random(4),
            'is_active' => true,
        ];
    }
}
