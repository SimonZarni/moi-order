<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('safety_locations', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('category', 50);                 // SafetyCategory enum value
            $table->string('phone', 100)->nullable();
            $table->string('location', 500)->nullable();    // human-readable location string
            $table->string('fb_page_link', 500)->nullable();
            $table->string('gmap_link', 500)->nullable();
            $table->text('description')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->json('photo_paths')->nullable();        // array of stored file paths
            $table->timestamps();
            $table->softDeletes();

            $table->index('category');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('safety_locations');
    }
};
