<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_card_routes', function (Blueprint $table): void {
            $table->id();
            $table->string('key', 100)->unique();
            $table->string('label_en', 100);
            $table->string('label_mm', 200);
            $table->string('type', 20);       // internal | external_url
            $table->string('url', 2048)->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index('is_active');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_card_routes');
    }
};
