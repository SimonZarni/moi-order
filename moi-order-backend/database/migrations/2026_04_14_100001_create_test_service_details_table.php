<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Principle: OCP — test-service-specific fields isolated here; no changes to shared tables.
return new class extends Migration
{
    public function up(): void
    {
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

    public function down(): void
    {
        Schema::dropIfExists('test_service_details');
    }
};
