export type Language = 'en' | 'my';

export type TranslationKey =
  | 'settings_title' | 'settings_preferences' | 'settings_account' | 'settings_restaurant'
  | 'settings_language' | 'settings_language_en' | 'settings_language_my'
  | 'settings_theme' | 'settings_theme_light' | 'settings_theme_dark'
  | 'settings_menu_view' | 'settings_menu_view_list' | 'settings_menu_view_grid'
  | 'settings_change_password' | 'settings_operating_hours'
  | 'change_password_title' | 'change_password_current' | 'change_password_new'
  | 'change_password_confirm' | 'change_password_success' | 'change_password_hint'
  | 'hours_title' | 'hours_day_sun' | 'hours_day_mon' | 'hours_day_tue' | 'hours_day_wed'
  | 'hours_day_thu' | 'hours_day_fri' | 'hours_day_sat'
  | 'hours_opens' | 'hours_closes' | 'hours_open' | 'hours_closed' | 'hours_not_set'
  | 'common_save' | 'common_cancel' | 'common_back' | 'common_saving' | 'common_back_to_settings';

type Translations = Record<TranslationKey, string>;

const EN: Translations = {
  settings_title: 'Settings',
  settings_preferences: 'Preferences',
  settings_account: 'Account',
  settings_restaurant: 'Restaurant',
  settings_language: 'Language',
  settings_language_en: 'English',
  settings_language_my: 'Myanmar (Burmese)',
  settings_theme: 'Theme',
  settings_theme_light: 'Light',
  settings_theme_dark: 'Dark',
  settings_menu_view: 'Menu View',
  settings_menu_view_list: 'List',
  settings_menu_view_grid: 'Grid',
  settings_change_password: 'Change Password',
  settings_operating_hours: 'Operating Hours',
  change_password_title: 'Change Password',
  change_password_current: 'Current Password',
  change_password_new: 'New Password',
  change_password_confirm: 'Confirm New Password',
  change_password_success: 'Password changed successfully.',
  change_password_hint: 'Must be at least 8 characters.',
  hours_title: 'Operating Hours',
  hours_day_sun: 'Sun',
  hours_day_mon: 'Mon',
  hours_day_tue: 'Tue',
  hours_day_wed: 'Wed',
  hours_day_thu: 'Thu',
  hours_day_fri: 'Fri',
  hours_day_sat: 'Sat',
  hours_opens: 'Opens',
  hours_closes: 'Closes',
  hours_open: 'Open',
  hours_closed: 'Closed',
  hours_not_set: 'Not set',
  common_save: 'Save',
  common_cancel: 'Cancel',
  common_back: 'Back',
  common_saving: 'Saving…',
  common_back_to_settings: '← Settings',
} as const;

const MY: Translations = {
  settings_title: 'ဆက်တင်များ',
  settings_preferences: 'နှစ်သက်မှုများ',
  settings_account: 'အကောင့်',
  settings_restaurant: 'စားသောက်ဆိုင်',
  settings_language: 'ဘာသာစကား',
  settings_language_en: 'English',
  settings_language_my: 'မြန်မာ',
  settings_theme: 'အပြင်အဆင်',
  settings_theme_light: 'အလင်း',
  settings_theme_dark: 'အမှောင်',
  settings_menu_view: 'မီနူးပြသမှု',
  settings_menu_view_list: 'စာရင်း',
  settings_menu_view_grid: 'ဂရစ်',
  settings_change_password: 'စကားဝှက်ပြောင်းရန်',
  settings_operating_hours: 'ဖွင့်ချိန်',
  change_password_title: 'စကားဝှက်ပြောင်းရန်',
  change_password_current: 'လက်ရှိစကားဝှက်',
  change_password_new: 'စကားဝှက်အသစ်',
  change_password_confirm: 'စကားဝှက်အသစ် အတည်ပြု',
  change_password_success: 'စကားဝှက် အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ။',
  change_password_hint: 'အနည်းဆုံး ၈ လုံး ရှိရမည်။',
  hours_title: 'ဖွင့်ချိန်',
  hours_day_sun: 'နွေ',
  hours_day_mon: 'လာ',
  hours_day_tue: 'ဂါ',
  hours_day_wed: 'ဟူး',
  hours_day_thu: 'တေး',
  hours_day_fri: 'ကြာ',
  hours_day_sat: 'နေ',
  hours_opens: 'ဖွင့်',
  hours_closes: 'ပိတ်',
  hours_open: 'ဖွင့်',
  hours_closed: 'ပိတ်',
  hours_not_set: 'မသတ်မှတ်ရသေး',
  common_save: 'သိမ်းရန်',
  common_cancel: 'ပယ်ဖျက်',
  common_back: 'နောက်သို့',
  common_saving: 'သိမ်းနေသည်…',
  common_back_to_settings: '← ဆက်တင်',
};

export const TRANSLATIONS: Record<Language, Translations> = { en: EN, my: MY };
