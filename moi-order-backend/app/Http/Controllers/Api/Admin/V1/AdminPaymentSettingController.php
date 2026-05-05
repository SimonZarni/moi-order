<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer for the global auto-payment toggle only.
 */
class AdminPaymentSettingController extends Controller
{
    /** GET /api/admin/v1/payment-settings */
    public function show(): JsonResponse
    {
        return response()->json([
            'data' => ['auto_payment_enabled' => AppSetting::isAutoPaymentEnabled()],
        ]);
    }

    /** PUT /api/admin/v1/payment-settings */
    public function update(): JsonResponse
    {
        $newValue = ! AppSetting::isAutoPaymentEnabled();
        AppSetting::set('auto_payment_enabled', $newValue ? '1' : '0');

        return response()->json([
            'data' => ['auto_payment_enabled' => $newValue],
        ]);
    }
}
