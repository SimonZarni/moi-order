<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Principle: OCP — company-registration-specific fields live here, not in service_submissions.
//   New service = new *_details table. Existing tables are untouched.
// Principle: SRP — owns only the applicant details for a company registration submission.
// One-to-one with service_submissions (unique FK enforced at DB level).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_registration_details', function (Blueprint $table): void {
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
        Schema::dropIfExists('company_registration_details');
    }
};
