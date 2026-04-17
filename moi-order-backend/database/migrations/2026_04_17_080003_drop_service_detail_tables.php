<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Option B migration step 3/3.
 * Drops all 8 hardcoded detail tables now that data has been migrated
 * into service_submissions.submission_data (step 2/3).
 *
 * down() recreates all tables with their original schemas so the full
 * migration stack can be rolled back cleanly.
 *
 * FK constraints are disabled during down() recreation to allow any order.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Disable FK checks so we can drop in any order
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('ninety_day_report_details');
        Schema::dropIfExists('company_registration_details');
        Schema::dropIfExists('airport_fast_track_details');
        Schema::dropIfExists('embassy_residential_details');
        Schema::dropIfExists('embassy_car_license_details');
        Schema::dropIfExists('embassy_bank_details');
        Schema::dropIfExists('embassy_visa_recommendation_details');
        Schema::dropIfExists('test_service_details');

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        // Simple detail tables (full_name + phone only)
        $simpleServices = [
            'ninety_day_report_details',
            'company_registration_details',
            'airport_fast_track_details',
            'embassy_residential_details',
            'embassy_car_license_details',
            'embassy_visa_recommendation_details',
        ];

        foreach ($simpleServices as $table) {
            Schema::create($table, function (Blueprint $t) use ($table): void {
                $t->id();
                $t->foreignId('submission_id')
                    ->unique()
                    ->constrained('service_submissions')
                    ->cascadeOnDelete();
                $t->string('full_name', 255);
                $t->string('phone', 30);
                $t->timestamps();
            });
        }

        // Embassy bank — extended text fields
        Schema::create('embassy_bank_details', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('submission_id')
                ->unique()
                ->constrained('service_submissions')
                ->cascadeOnDelete();
            $table->string('full_name');
            $table->string('passport_no');
            $table->string('identity_card_no');
            $table->string('current_job')->nullable();
            $table->string('company')->nullable();
            $table->string('myanmar_address');
            $table->string('thai_address');
            $table->string('phone', 30);
            $table->string('bank_name');
            $table->timestamps();
        });

        // Test service — no unique constraint on submission_id (matches original)
        Schema::create('test_service_details', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('submission_id')
                ->constrained('service_submissions')
                ->cascadeOnDelete();
            $table->string('full_name', 255);
            $table->string('phone', 30);
            $table->timestamps();

            $table->index('submission_id');
        });
    }
};
