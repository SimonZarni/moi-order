<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_notifications', function (Blueprint $table): void {
            $table->id();
            $table->string('title', 100);
            $table->string('body', 500);
            $table->string('target_type', 10);                                        // 'all' | 'single'
            $table->foreignId('target_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->unsignedInteger('recipients_count')->default(0);
            $table->timestamp('sent_at');
            $table->timestamps();

            $table->index('sent_at');
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_notifications');
    }
};
