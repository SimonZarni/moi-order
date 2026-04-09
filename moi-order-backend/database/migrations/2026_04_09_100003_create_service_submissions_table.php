<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Principle: OCP — base submission table shared by all services.
//   New service = new *_details table. Zero schema changes here.
// Security: price_snapshot captures price at submission time.
//   Admin price changes never affect historical submissions.
// Security: idempotency_key (UUID) prevents duplicate submissions on retry.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_submissions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignId('service_type_id')
                ->constrained('service_types')
                ->restrictOnDelete();
            $table->unsignedBigInteger('price_snapshot'); // satangs — immutable after insert
            $table->string('status', 20)->default('processing');
            $table->uuid('idempotency_key')->unique();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes()->index();

            $table->index('user_id');
            $table->index('service_type_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_submissions');
    }
};
