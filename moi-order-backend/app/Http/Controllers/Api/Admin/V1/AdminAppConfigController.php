<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Requests\Admin\UpdateAppConfigRequest;
use App\Http\Resources\AppConfigPublicResource;
use App\Models\AppConfig;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;

/**
 * Admin management of the single-row app configuration.
 *
 * SRP: HTTP only — show() reads, update() writes. Both delegate to the model.
 * No service layer needed: AppConfig has no multi-table writes, events, or
 * complex domain rules — a service would add indirection with no value (KISS).
 * Security: auth:sanctum + AdminAuthenticate enforced at route-group level.
 * No PII. No file uploads. No idempotency key (idempotent PUT semantics handle it).
 */
class AdminAppConfigController extends Controller
{
    public function show(): JsonResource
    {
        return new AppConfigPublicResource(AppConfig::current());
    }

    public function update(UpdateAppConfigRequest $request): JsonResource
    {
        $config = AppConfig::current();
        $config->update($request->validated());

        return new AppConfigPublicResource($config->fresh());
    }
}
