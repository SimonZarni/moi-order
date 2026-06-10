<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Webhook;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

/**
 * Receives LINE Messaging API webhook events.
 * Primary use: capture the group ID when the OA is added to a staff group.
 * intentionally public — LINE does not send a Bearer token; the X-Line-Signature header is the auth.
 */
class LineWebhookController extends Controller
{
    public function handle(Request $request): Response
    {
        $events = $request->input('events', []);

        foreach ($events as $event) {
            $type       = $event['type']   ?? '';
            $sourceType = $event['source']['type'] ?? '';

            if ($type === 'join' && $sourceType === 'group') {
                $groupId = $event['source']['groupId'] ?? 'unknown';
                Log::info('LINE webhook: OA joined a group', ['group_id' => $groupId]);
            }
        }

        // LINE requires a 200 response within 1 second.
        return response('', 200);
    }
}
