<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — serves the platform alarm sound URL to authenticated merchants.
 */
class MerchantAlarmSettingController extends Controller
{
    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    /** GET /api/merchant/v1/alarm-sound */
    public function show(): JsonResponse
    {
        $path = AppSetting::getAlarmSoundPath();

        return response()->json([
            'data' => [
                'alarm_sound_url' => $path ? $this->storage->publicUrl($path) : null,
            ],
        ]);
    }
}
