<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emergency_contacts', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 20);                           // EmergencyContactType enum value
            $table->string('title_en', 255);
            $table->string('title_mm', 255);
            $table->string('title_th', 255)->nullable();
            $table->text('description_en')->nullable();
            $table->text('description_mm')->nullable();
            $table->text('description_th')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('map_url', 1000)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('location', 500)->nullable();          // Human-readable location (rescue)
            $table->string('facebook_url', 1000)->nullable();
            $table->string('website_url', 1000)->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('position')->default(0);
            $table->softDeletes();
            $table->timestamps();

            // Filtering by type is the primary query pattern
            $table->index(['type', 'is_active', 'position']);
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emergency_contacts');
    }
};
