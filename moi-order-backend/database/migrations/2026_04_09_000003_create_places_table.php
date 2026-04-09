<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('name_my');
            $table->string('name_th');
            $table->string('short_description', 500);
            $table->longText('long_description');
            $table->text('address');
            $table->string('city', 100);
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('opening_hours', 100)->nullable();
            $table->string('contact_phone', 20)->nullable();
            $table->string('website', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index('category_id');
            $table->index('deleted_at');
            $table->index('city');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('places');
    }
};
