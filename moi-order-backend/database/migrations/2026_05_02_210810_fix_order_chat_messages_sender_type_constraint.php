<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Original constraint only permitted 'user'|'admin'.
        // Controllers insert 'customer' (customer API) and 'merchant' (merchant API).
        DB::statement('ALTER TABLE order_chat_messages DROP CONSTRAINT chk_sender_type');
        DB::statement("ALTER TABLE order_chat_messages ADD CONSTRAINT chk_sender_type CHECK (sender_type IN ('customer', 'merchant', 'admin'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE order_chat_messages DROP CONSTRAINT chk_sender_type');
        DB::statement("ALTER TABLE order_chat_messages ADD CONSTRAINT chk_sender_type CHECK (sender_type IN ('user', 'admin'))");
    }
};
