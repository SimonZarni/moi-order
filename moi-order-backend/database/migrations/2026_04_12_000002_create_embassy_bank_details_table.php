<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Principle: OCP — embassy bank applicant fields isolated in own table.
//   New service = new detail table. service_submissions is never altered.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('embassy_bank_details', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('submission_id')
                ->unique()
                ->constrained('service_submissions')
                ->cascadeOnDelete();

            // Applicant text fields
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
    }

    public function down(): void
    {
        Schema::dropIfExists('embassy_bank_details');
    }
};
