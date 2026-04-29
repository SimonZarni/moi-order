<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\DocumentType;
use App\Models\Document;
use App\Models\User;
use App\Notifications\NinetyDayReportReminderNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * Runs daily via the scheduler. For each user with a 90-day report document,
 * checks whether today falls on a notification day and sends the reminder.
 *
 * Notification schedule (days remaining until extension_date):
 *   20        — one-time green suggestion
 *   10        — one-time yellow warning
 *    8        — one-time yellow warning
 *   7 → 0    — daily red alert
 *  -1 → -7   — daily red overdue alert
 *  all others — silent
 */
class SendNinetyDayReportReminders extends Command
{
    protected $signature   = 'documents:send-ninety-day-reminders';
    protected $description = 'Send 90-day report push notifications and in-app alerts';

    private const SINGLE_SHOT_DAYS = [20, 10, 8];
    private const DAILY_RANGE      = [-7, 7]; // inclusive on both ends (0 days remaining included)

    public function handle(): int
    {
        $today = Carbon::today();

        // For each user, use only their most recent valid 90-day report.
        $documents = Document::query()
            ->where('type', DocumentType::NinetyDayReport->value)
            ->where('is_valid_type', true)
            ->whereNotNull('extension_date')
            ->orderByDesc('extension_date')
            ->get()
            ->unique('user_id'); // keep most recent per user

        $sent = 0;

        foreach ($documents as $document) {
            $daysRemaining = (int) $today->diffInDays($document->extension_date, false);

            if (!$this->shouldNotify($daysRemaining)) {
                continue;
            }

            /** @var User|null $user */
            $user = User::find($document->user_id);
            if ($user === null) {
                continue;
            }

            try {
                $user->notify(new NinetyDayReportReminderNotification($daysRemaining));
                $sent++;
            } catch (\Throwable $e) {
                Log::error('SendNinetyDayReportReminders: notification failed', [
                    'user_id'       => $document->user_id,
                    'days_remaining' => $daysRemaining,
                    'error'         => $e->getMessage(),
                ]);
            }
        }

        $this->info("Sent {$sent} 90-day report reminder(s).");

        return self::SUCCESS;
    }

    private function shouldNotify(int $daysRemaining): bool
    {
        if (in_array($daysRemaining, self::SINGLE_SHOT_DAYS, true)) {
            return true;
        }

        return $daysRemaining >= self::DAILY_RANGE[0]
            && $daysRemaining <= self::DAILY_RANGE[1];
    }
}
