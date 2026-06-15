<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;

/**
 * Expands the merchant_notifications.type CHECK constraint to include
 * 'chat_message'. The original constraint only listed new_order|order_status|system,
 * which caused NotifyMerchantOfChatMessage queue jobs to fail with a constraint
 * violation — silently dropping all chat message notifications.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE merchant_notifications DROP CONSTRAINT chk_mn_type');
        DB::statement(
            "ALTER TABLE merchant_notifications
             ADD CONSTRAINT chk_mn_type
             CHECK (`type` IN ('new_order','order_status','chat_message','system'))",
        );
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE merchant_notifications DROP CONSTRAINT chk_mn_type');
        DB::statement(
            "ALTER TABLE merchant_notifications
             ADD CONSTRAINT chk_mn_type
             CHECK (`type` IN ('new_order','order_status','system'))",
        );
    }
};
