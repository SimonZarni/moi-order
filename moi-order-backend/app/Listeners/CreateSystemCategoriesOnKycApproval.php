<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\KycApplicationApproved;
use App\Services\MenuService;

/**
 * Principle: SRP — one reaction: seed system menu categories when an initial KYC is approved.
 * Not queued: the merchant may log in immediately after approval and expects the categories
 * to already exist. The operation is a handful of DB inserts — safe to run inline.
 */
class CreateSystemCategoriesOnKycApproval
{
    public function __construct(private readonly MenuService $menuService) {}

    public function handle(KycApplicationApproved $event): void
    {
        // Resubmissions only update restaurant name/address — no new restaurant is created.
        if ($event->application->type !== 'initial') {
            return;
        }

        $restaurant = $event->application->applicant->restaurant()->first();

        if ($restaurant === null) {
            return;
        }

        // createSystemCategoriesForRestaurant() is idempotent — safe to call even if
        // categories already exist (e.g. a prior draft or backfill command ran first).
        $this->menuService->createSystemCategoriesForRestaurant($restaurant);
    }
}
