<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('push_subscriptions', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // endpoint is the browser vendor URL — globally unique per browser/device
            $table->text('endpoint');
            $table->string('p256dh_key', 255);
            $table->string('auth_key', 255);
            $table->timestamps();

            // One subscription per endpoint globally (browsers reuse endpoints)
            $table->unique(['user_id', 'endpoint'], 'push_subscriptions_user_endpoint_unique');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('push_subscriptions');
    }
};
