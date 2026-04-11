<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// Principle: OCP — extend the allowed document types without modifying previous migrations.
// Adds upper_body_photo and airplane_ticket for the airport fast track service.
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE submission_documents DROP CONSTRAINT chk_document_type');

        DB::statement(
            "ALTER TABLE submission_documents
             ADD CONSTRAINT chk_document_type
             CHECK (document_type IN (
                 'passport_bio_page',
                 'visa_page',
                 'old_slip',
                 'identity_card_front',
                 'identity_card_back',
                 'tm30',
                 'upper_body_photo',
                 'airplane_ticket'
             ))"
        );
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE submission_documents DROP CONSTRAINT chk_document_type');

        DB::statement(
            "ALTER TABLE submission_documents
             ADD CONSTRAINT chk_document_type
             CHECK (document_type IN (
                 'passport_bio_page',
                 'visa_page',
                 'old_slip',
                 'identity_card_front',
                 'identity_card_back',
                 'tm30'
             ))"
        );
    }
};
