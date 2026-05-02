<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_chat_messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('food_order_id')->constrained('food_orders')->cascadeOnDelete();
            $table->string('sender_type', 10);  // 'user' | 'admin' — CHECK constraint below
            $table->unsignedBigInteger('sender_id');
            $table->string('sender_name');
            $table->text('body')->nullable();
            $table->string('image_path')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['food_order_id', 'created_at']);
            $table->index('deleted_at');
        });

        // VARCHAR + CHECK (CLAUDE.md: no MySQL ENUM type)
        DB::statement("ALTER TABLE order_chat_messages ADD CONSTRAINT chk_sender_type CHECK (sender_type IN ('user', 'admin'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('order_chat_messages');
    }
};
