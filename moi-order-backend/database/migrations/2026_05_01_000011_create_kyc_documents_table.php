<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Principle: MySQL Rules — FK constraints, composite index on (kyc_application_id, type)
 *   to enforce uniqueness in queries, deleted_at indexed, down() written.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kyc_documents', function (Blueprint $table): void {
            $table->id();

            $table->foreignId('kyc_application_id')
                ->constrained('kyc_applications')
                ->cascadeOnDelete();

            // VARCHAR — KycDocumentType enum values are stored here.
            $table->string('type', 100);

            // UUID-named path outside public/ — never expose directly.
            $table->string('file_path', 500);

            $table->softDeletes();
            $table->timestamps();

            // Composite index: filtering docs by application + type is the main query pattern.
            $table->index(['kyc_application_id', 'type']);
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kyc_documents');
    }
};
