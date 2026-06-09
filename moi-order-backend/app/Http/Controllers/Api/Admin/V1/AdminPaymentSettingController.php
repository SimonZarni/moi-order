<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePaymentModeRequest;
use App\Http\Requests\Admin\UploadGlobalQrRequest;
use App\Models\AppSetting;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer for payment configuration settings only.
 */
class AdminPaymentSettingController extends Controller
{
    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    /** GET /api/admin/v1/payment-settings */
    public function show(): JsonResponse
    {
        $qrPath = AppSetting::getPromptPayQrImageUrl();

        return response()->json([
            'data' => [
                'auto_payment_enabled'  => AppSetting::isAutoPaymentEnabled(),
                'payment_mode'          => AppSetting::getPaymentMode()->value,
                'global_qr_image_url'   => $qrPath ? $this->storage->publicUrl($qrPath) : null,
                'bank_name'             => AppSetting::getPromptPayBankName(),
                'bank_account_number'   => AppSetting::getPromptPayBankAccountNumber(),
                'bank_account_name'     => AppSetting::getPromptPayBankAccountName(),
            ],
        ]);
    }

    /** PUT /api/admin/v1/payment-settings — toggle auto_payment_enabled */
    public function update(): JsonResponse
    {
        $newValue = ! AppSetting::isAutoPaymentEnabled();
        AppSetting::set('auto_payment_enabled', $newValue ? '1' : '0');

        return response()->json([
            'data' => ['auto_payment_enabled' => $newValue],
        ]);
    }

    /** PATCH /api/admin/v1/payment-settings/mode */
    public function updateMode(UpdatePaymentModeRequest $request): JsonResponse
    {
        AppSetting::setPaymentMode($request->enum('mode', \App\Enums\PaymentMode::class));
        AppSetting::setPromptPayBankInfo(
            $request->string('bank_name')->toString() ?: null,
            $request->string('bank_account_number')->toString() ?: null,
            $request->string('bank_account_name')->toString() ?: null,
        );

        return response()->json(['data' => ['payment_mode' => AppSetting::getPaymentMode()->value]]);
    }

    /** POST /api/admin/v1/payment-settings/qr */
    public function uploadGlobalQr(UploadGlobalQrRequest $request): JsonResponse
    {
        // Delete old global QR if present.
        $existing = AppSetting::getPromptPayQrImageUrl();
        if ($existing !== null && ! str_starts_with($existing, 'http')) {
            $this->storage->delete($existing);
        }

        $path = $this->storage->store(
            $request->file('image'),
            'promptpay-qr',
            ['image/jpeg', 'image/png', 'image/webp'],
        );

        AppSetting::setPromptPayQrImageUrl($path);

        return response()->json([
            'data' => ['global_qr_image_url' => $this->storage->publicUrl($path)],
        ]);
    }

    /** DELETE /api/admin/v1/payment-settings/qr */
    public function removeGlobalQr(): JsonResponse
    {
        $existing = AppSetting::getPromptPayQrImageUrl();
        if ($existing !== null && ! str_starts_with($existing, 'http')) {
            $this->storage->delete($existing);
        }

        AppSetting::setPromptPayQrImageUrl(null);

        return response()->json(['data' => ['global_qr_image_url' => null]]);
    }
}
