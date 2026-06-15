<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const FEE_MULTIPLIER = 1.05;
    private const FEE_DIVISOR   = 1 / self::FEE_MULTIPLIER;

    /**
     * Multiply all existing menu item prices by 1.05 so that the 5% platform
     * fee is embedded in the stored price. Going forward, the merchant UI
     * applies the same multiplier before sending price_cents to the API, so
     * items created after this migration are already correct.
     */
    public function up(): void
    {
        DB::statement(
            'UPDATE menu_items SET price_cents = ROUND(price_cents * ?) WHERE price_cents IS NOT NULL',
            [self::FEE_MULTIPLIER],
        );

        DB::statement(
            'UPDATE menu_items SET original_price_cents = ROUND(original_price_cents * ?) WHERE original_price_cents IS NOT NULL',
            [self::FEE_MULTIPLIER],
        );
    }

    /**
     * Reverse: divide back by 1.05 to restore pre-fee prices.
     */
    public function down(): void
    {
        DB::statement(
            'UPDATE menu_items SET price_cents = ROUND(price_cents * ?) WHERE price_cents IS NOT NULL',
            [self::FEE_DIVISOR],
        );

        DB::statement(
            'UPDATE menu_items SET original_price_cents = ROUND(original_price_cents * ?) WHERE original_price_cents IS NOT NULL',
            [self::FEE_DIVISOR],
        );
    }
};
