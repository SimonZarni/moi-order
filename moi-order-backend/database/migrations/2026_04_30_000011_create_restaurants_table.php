<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('phone')->nullable();
            $table->string('cover_photo_path')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('status', 20)->default('closed');
            $table->decimal('delivery_radius_km', 5, 2)->nullable()->comment('null = no radius limit');
            $table->boolean('is_delivery_available')->default(true);
            $table->boolean('is_pickup_available')->default(true);
            $table->bigInteger('min_order_cents')->unsigned()->default(0);
            $table->softDeletes();
            $table->timestamps();

            // Principle: MySQL — index every WHERE/ORDER BY column.
            $table->index('user_id');
            $table->index('status');
            $table->index(['latitude', 'longitude']);
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
