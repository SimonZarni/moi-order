<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_cards', function (Blueprint $table): void {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->unsignedTinyInteger('position');
            $table->string('title_en', 100);
            $table->string('title_mm', 200);
            $table->string('subtitle_en', 200)->nullable();
            $table->string('subtitle_mm', 400)->nullable();
            $table->string('tag_en', 50);
            $table->string('tag_mm', 100);
            $table->string('accent_color', 20);
            $table->string('icon_key', 50);
            $table->string('navigation_screen', 100);
            $table->json('navigation_params')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_coming_soon')->default(false);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['is_active', 'position']);
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_cards');
    }
};
