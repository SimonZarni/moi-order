<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadAlarmSoundRequest;
use App\Models\AppSetting;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer for platform-wide alarm sound setting only.
 */
class AdminAlarmSettingController extends Controller
{
    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    /** GET /api/admin/v1/alarm-sound */
    public function show(): JsonResponse
    {
        $path = AppSetting::getAlarmSoundPath();

        return response()->json([
            'data' => [
                'alarm_sound_url' => $path ? $this->storage->publicUrl($path) : null,
            ],
        ]);
    }

    /** POST /api/admin/v1/alarm-sound */
    public function upload(UploadAlarmSoundRequest $request): JsonResponse
    {
        $existing = AppSetting::getAlarmSoundPath();
        if ($existing !== null) {
            $this->storage->delete($existing);
        }

        $path = $this->storage->store(
            $request->file('sound'),
            'alarm-sounds',
            ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-wav'],
        );

        AppSetting::setAlarmSoundPath($path);

        return response()->json([
            'data' => ['alarm_sound_url' => $this->storage->publicUrl($path)],
        ], 201);
    }

    /** DELETE /api/admin/v1/alarm-sound */
    public function remove(): JsonResponse
    {
        $existing = AppSetting::getAlarmSoundPath();
        if ($existing !== null) {
            $this->storage->delete($existing);
        }

        AppSetting::setAlarmSoundPath(null);

        return response()->json(['data' => ['alarm_sound_url' => null]]);
    }
}
