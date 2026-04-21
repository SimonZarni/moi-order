<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1 — add nullable FK column if it doesn't already exist (idempotent).
        if (! Schema::hasColumn('submission_documents', 'document_type_id')) {
            Schema::table('submission_documents', function (Blueprint $table): void {
                $table->foreignId('document_type_id')
                    ->nullable()
                    ->after('submission_id')
                    ->constrained('document_types')
                    ->restrictOnDelete();
            });
        }

        // Step 2 — backfill only rows still missing the FK value.
        // COLLATE forces both sides to the same collation — needed when the old table
        // (utf8mb4_unicode_ci) and new table (utf8mb4_0900_ai_ci) differ.
        if (Schema::hasColumn('submission_documents', 'document_type')) {
            DB::statement('
                UPDATE submission_documents sd
                JOIN document_types dt
                  ON dt.slug COLLATE utf8mb4_unicode_ci = sd.document_type COLLATE utf8mb4_unicode_ci
                SET sd.document_type_id = dt.id
                WHERE sd.document_type_id IS NULL
            ');
        }

        // Step 3 — enforce NOT NULL now that all rows are filled.
        Schema::table('submission_documents', function (Blueprint $table): void {
            $table->unsignedBigInteger('document_type_id')->nullable(false)->change();
        });

        // Step 4 — drop the old CHECK constraint and VARCHAR column if still present.
        if (Schema::hasColumn('submission_documents', 'document_type')) {
            try {
                DB::statement('ALTER TABLE submission_documents DROP CONSTRAINT chk_document_type');
            } catch (\Throwable) {
                // constraint may have already been dropped
            }

            Schema::table('submission_documents', function (Blueprint $table): void {
                $table->dropColumn('document_type');
            });
        }
    }

    public function down(): void
    {
        Schema::table('submission_documents', function (Blueprint $table): void {
            $table->string('document_type', 50)->nullable()->after('submission_id');
        });

        DB::statement('
            UPDATE submission_documents sd
            JOIN document_types dt ON dt.id = sd.document_type_id
            SET sd.document_type = dt.slug
        ');

        Schema::table('submission_documents', function (Blueprint $table): void {
            $table->string('document_type', 50)->nullable(false)->change();
        });

        DB::statement(
            "ALTER TABLE submission_documents
             ADD CONSTRAINT chk_document_type
             CHECK (document_type IN (
                 'passport_bio_page','visa_page','old_slip',
                 'identity_card_front','identity_card_back','tm30',
                 'upper_body_photo','airplane_ticket','passport_size_photo','test_photo'
             ))"
        );

        Schema::table('submission_documents', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('document_type_id');
        });
    }
};
