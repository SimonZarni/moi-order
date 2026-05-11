<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\AppConfigPublicResource;
use App\Models\AppConfig;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;

/**
 * Public endpoint — no authentication required.
 * Returns the single-row app configuration so the client can enforce update
 * gating and display in-app alerts on every launch.
 *
 * SRP: HTTP only — delegates data retrieval to AppConfig::current().
 * Controller has one action, one service call, returns one Resource.
 */
class AppConfigController extends Controller
{
    // intentionally public — called on every app launch before the user authenticates
    public function index(): JsonResource
    {
        return new AppConfigPublicResource(AppConfig::current());
    }
}
