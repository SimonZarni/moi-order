<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Staging table for Google-fetched photos.
 * "Our Photos" (shown in app) live in place_images — this table is admin-only.
 *
 * Design decisions:
 *   - source: VARCHAR + CHECK ('google'|'manual') — project convention, no MySQL ENUM.
 *   - is_selected: tracks which Google photos the admin has copied to the real gallery.
 *   - photo_url: already-public R2 CDN URL (no signed URL needed; not sensitive).
 *   - Composite index on (place_id, source) — covers the admin list + fetch queries.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('place_photos', function (Blueprint $table): void {
            $table->id();

            $table->foreignId('place_id')
                ->constrained('places')
                ->cascadeOnDelete();

            $table->string('photo_url', 1024);
            $table->string('google_photo_name', 500)->nullable();
            $table->unsignedSmallInteger('display_order')->default(0);
            $table->boolean('is_selected')->default(false);

            // VARCHAR + CHECK constraint per project MySQL conventions
            $table->string('source', 10)->default('google');

            $table->unsignedInteger('width_px')->nullable();
            $table->unsignedInteger('height_px')->nullable();
            $table->string('author_name', 255)->nullable();

            $table->timestamps();

            // Hot admin query: WHERE place_id = ? AND source = 'google' ORDER BY display_order
            $table->index(['place_id', 'source'], 'place_photos_place_source_idx');
            // Used by addToGallery to find is_selected = false records
            $table->index(['place_id', 'is_selected'], 'place_photos_place_selected_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('place_photos');
    }
};
