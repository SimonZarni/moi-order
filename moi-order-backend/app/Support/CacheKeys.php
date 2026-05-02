<?php

declare(strict_types=1);

namespace App\Support;

final class CacheKeys
{
    public const HOME_CARDS_VISIBLE        = 'home_cards:visible';
    public const SERVICE_CATEGORIES_ACTIVE = 'service_categories:active';
    public const DOCUMENT_TYPES_ACTIVE     = 'document_types:active';
    public const HOME_CARD_ICONS_ACTIVE    = 'home_card_icons:active';
    public const HOME_CARD_ROUTES_ACTIVE   = 'home_card_routes:active';

    // Cache tag names — used for paginated resources where multiple keys share a group
    public const TAG_CATEGORIES = 'categories';
    public const TAG_TAGS       = 'tags';
}
