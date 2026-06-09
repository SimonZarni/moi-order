<?php

declare(strict_types=1);

use App\Models\AppSetting;
use Illuminate\Database\Migrations\Migration;

/**
 * Seed the default payment_mode so getPaymentMode() never falls back to a blank value.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (AppSetting::get('payment_mode') === null) {
            AppSetting::set('payment_mode', 'stripe');
        }
    }

    public function down(): void
    {
        AppSetting::where('key', 'payment_mode')->delete();
    }
};
