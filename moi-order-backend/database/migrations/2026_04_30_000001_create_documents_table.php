<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Document category (passport | ninety_day_report | other)
            $table->string('type', 50);

            // What Claude detected within the category (bio_page, visa_page, etc.)
            $table->string('subtype', 100)->nullable();

            // Encrypted — passport image path is PII
            $table->text('file_path');

            // Encrypted JSON — extracted fields from OCR
            $table->longText('extracted_data')->nullable();

            // Key dates surfaced from extracted_data for quick querying
            $table->date('expiry_date')->nullable();
            $table->date('extension_date')->nullable(); // next report date for 90-day slips

            $table->boolean('is_valid_type')->default(true);
            $table->string('validation_message', 500)->nullable();

            $table->softDeletes();
            $table->timestamps();

            // Compound index: all user document queries filter by user + type
            $table->index(['user_id', 'type', 'deleted_at']);
            $table->index(['user_id', 'expiry_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
