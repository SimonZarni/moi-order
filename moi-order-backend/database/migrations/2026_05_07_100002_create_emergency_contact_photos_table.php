<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emergency_contact_photos', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('emergency_contact_id')
                ->constrained('emergency_contacts')
                ->cascadeOnDelete();
            $table->string('path', 1000);
            $table->boolean('is_cover')->default(false);
            $table->unsignedSmallInteger('position')->default(0);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['emergency_contact_id', 'position']);
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emergency_contact_photos');
    }
};
