<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_chat_messages', function (Blueprint $table): void {
            $table->unsignedBigInteger('reply_to_id')->nullable()->after('read_at');
            $table->string('reply_to_body', 500)->nullable()->after('reply_to_id');
            $table->string('reply_to_sender_name', 100)->nullable()->after('reply_to_body');

            $table->foreign('reply_to_id')
                  ->references('id')
                  ->on('order_chat_messages')
                  ->nullOnDelete();

            $table->index('reply_to_id');
        });
    }

    public function down(): void
    {
        Schema::table('order_chat_messages', function (Blueprint $table): void {
            $table->dropForeign(['reply_to_id']);
            $table->dropIndex(['reply_to_id']);
            $table->dropColumn(['reply_to_id', 'reply_to_body', 'reply_to_sender_name']);
        });
    }
};
