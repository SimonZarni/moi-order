<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_activity_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Backed enum value stored as VARCHAR — avoids MySQL ENUM lock-in.
            $table->string('event', 60);
            $table->string('event_label', 120);
            $table->string('category', 30); // auth | security | social | account

            // Extra context: who triggered it, what changed.
            $table->json('metadata')->nullable();

            // Network context — useful for spotting suspicious activity patterns.
            $table->string('ip_address', 45)->nullable(); // 45 = max IPv6 length
            $table->string('user_agent', 512)->nullable();

            // Append-only — no updated_at.
            $table->timestamp('created_at')->useCurrent();

            // Query patterns: most recent events per user; filter by category+user.
            $table->index(['user_id', 'created_at']);
            $table->index(['user_id', 'category', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_activity_logs');
    }
};
