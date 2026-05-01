<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_card_icons', function (Blueprint $table): void {
            $table->id();
            $table->string('key', 100)->unique();
            $table->string('label', 100);
            $table->string('type', 20);        // builtin | custom
            $table->string('image_path', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index('is_active');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_card_icons');
    }
};
