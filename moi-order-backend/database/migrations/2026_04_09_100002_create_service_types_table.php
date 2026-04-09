<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Principle: SRP — one concern: subtypes and their prices under a service.
// Price in satangs (BIGINT UNSIGNED) — server always the source of truth for price.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_types', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('service_id')
                ->constrained('services')
                ->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('name_en', 100);
            $table->unsignedBigInteger('price'); // in satangs
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes()->index();

            $table->index('service_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_types');
    }
};
