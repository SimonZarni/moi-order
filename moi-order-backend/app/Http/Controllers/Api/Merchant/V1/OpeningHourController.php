<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\ToggleSessionMenuEnabledRequest;
use App\Models\RestaurantOpeningHour;
use Illuminate\Http\JsonResponse;

class OpeningHourController extends Controller
{
    public function toggleSessionMenu(ToggleSessionMenuEnabledRequest $request, int $openingHourId): JsonResponse
    {
        $restaurant = $request->user()->restaurant;

        abort_if($restaurant === null, 403);

        $hour = RestaurantOpeningHour::where('id', $openingHourId)
            ->where('restaurant_id', $restaurant->id)
            ->firstOrFail();

        $hour->update(['session_menu_enabled' => $request->boolean('enabled')]);

        return response()->json([
            'data' => [
                'id'                   => $hour->id,
                'session_menu_enabled' => $hour->session_menu_enabled,
            ],
        ]);
    }
}
