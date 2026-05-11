<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('in_app_alerts', static function (Blueprint $table): void {
            $table->id();

            $table->string('title', 255);
            $table->text('message');
            $table->string('image_path', 500)->nullable();

            // Mirrors AppAlertFrequency: once_per_day | every_open
            // Rule: max 1 active row per frequency value at any time (enforced by service layer).
            $table->string('frequency', 20);
            $table->boolean('is_active')->default(false);

            // Nullable so deleting the admin user does not cascade-delete historic alerts.
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            // Public API lookup: WHERE is_active = 1 — covering index.
            $table->index(['is_active', 'frequency']);
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('in_app_alerts');
    }
};
