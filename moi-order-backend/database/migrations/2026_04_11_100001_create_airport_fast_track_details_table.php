<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Principle: OCP — airport-fast-track-specific fields live here, not in service_submissions.
//   When a new service is added, a new *_details table is created. This table is untouched.
// Principle: SRP — owns only the fields relevant to airport fast track submissions.
// One-to-one with service_submissions (unique FK enforced at DB level).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('airport_fast_track_details', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('submission_id')
                ->unique() // enforces one-to-one
                ->constrained('service_submissions')
                ->cascadeOnDelete();
            $table->string('full_name', 255);
            $table->string('phone', 30);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('airport_fast_track_details');
    }
};
