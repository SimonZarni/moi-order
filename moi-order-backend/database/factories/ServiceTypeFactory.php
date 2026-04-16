<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Service;
use App\Models\ServiceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceType>
 */
class ServiceTypeFactory extends Factory
{
    protected $model = ServiceType::class;

    public function definition(): array
    {
        $name = fake()->words(2, true);

        return [
            'service_id' => Service::factory(),
            'name'       => $name,
            'name_en'    => $name,
            'price'      => fake()->numberBetween(500_00, 5000_00), // satangs
            'is_active'  => true,
        ];
    }
}
