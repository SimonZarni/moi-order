<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\SubmissionStatus;
use App\Models\ServiceSubmission;
use App\Models\ServiceType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ServiceSubmission>
 */
class ServiceSubmissionFactory extends Factory
{
    protected $model = ServiceSubmission::class;

    public function definition(): array
    {
        return [
            'user_id'         => User::factory(),
            'service_type_id' => ServiceType::factory(),
            'price_snapshot'  => fake()->numberBetween(500_00, 5000_00),
            'status'          => SubmissionStatus::PendingPayment,
            'idempotency_key' => Str::uuid()->toString(),
            'completed_at'    => null,
        ];
    }

    public function processing(): static
    {
        return $this->state(['status' => SubmissionStatus::Processing]);
    }

    public function completed(): static
    {
        return $this->state([
            'status'       => SubmissionStatus::Completed,
            'completed_at' => now(),
        ]);
    }

    public function paymentFailed(): static
    {
        return $this->state(['status' => SubmissionStatus::PaymentFailed]);
    }
}
