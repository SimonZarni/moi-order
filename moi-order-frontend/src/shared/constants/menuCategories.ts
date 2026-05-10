import { MENU_CATEGORY_TYPE, MenuCategoryType } from '@/types/enums';

/** Human-readable labels for system category type keys. */
export const SYSTEM_CATEGORY_LABELS: Record<MenuCategoryType, string> = {
  [MENU_CATEGORY_TYPE.PopularPicks]:    'Popular Picks',
  [MENU_CATEGORY_TYPE.Promotions]:      'Promotions',
  [MENU_CATEGORY_TYPE.Recommendations]: 'Recommendations',
};

/** Canonical display order — system categories appear before merchant-added ones. */
export const SYSTEM_CATEGORY_ORDER: MenuCategoryType[] = [
  MENU_CATEGORY_TYPE.PopularPicks,
  MENU_CATEGORY_TYPE.Promotions,
  MENU_CATEGORY_TYPE.Recommendations,
];
