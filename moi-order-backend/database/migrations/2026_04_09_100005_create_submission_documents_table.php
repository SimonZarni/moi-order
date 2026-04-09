<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Principle: SRP — owns only uploaded document references per submission.
// Security: file_path stores the UUID-renamed path under storage/app/private/.
//   Signed URLs (30-min TTL) are generated at read time via FileStorageService.
//   Original filenames are never stored.
// document_type constrained by CHECK to match DocumentType enum values.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submission_documents', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('submission_id')
                ->constrained('service_submissions')
                ->cascadeOnDelete();

            // VARCHAR + CHECK constraint — no MySQL ENUM type per project rules.
            $table->string('document_type', 50);
            $table->string('file_path', 500);

            $table->timestamps();
            $table->softDeletes()->index();

            $table->index('submission_id');

            // Enforce only known document types at DB level.
            $table->rawIndex(
                "document_type",
                'submission_documents_document_type_index'
            );
        });

        // CHECK constraint: restrict to known DocumentType enum values.
        DB::statement(
            "ALTER TABLE submission_documents
             ADD CONSTRAINT chk_document_type
             CHECK (document_type IN ('passport_bio_page', 'visa_page', 'old_slip'))"
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('submission_documents');
    }
};
