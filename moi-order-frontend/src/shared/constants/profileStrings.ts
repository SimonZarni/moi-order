import { Locale } from '@/shared/store/localeStore';

const PROFILE_STRINGS = {
  en: {
    personalInfo:       'Personal Info',
    language:           'Language',
    activity:           'Activity',
    security:           'Security',
    legal:              'Legal',
    myOrders:           'My Orders',
    changePassword:     'Change Password',
    privacyPolicy:      'Privacy Policy',
    termsConditions:    'Terms & Conditions',
    pdpa:               'Personal Data Protection Act',
    fullNamePlaceholder:    'Full name',
    dobPlaceholder:         'Date of birth',
    currentPassword:        'Current password',
    newPassword:            'New password',
    confirmNewPassword:     'Confirm new password',
    updatePassword:         'Update Password',
    saveChanges:            'Save Changes',
  },
  mm: {
    personalInfo:       'ကိုယ်ရေးအချက်အလက်',
    language:           'ဘာသာစကား',
    activity:           'လုပ်ဆောင်ချက်များ',
    security:           'လုံခြုံရေး',
    legal:              'ဥပဒေရေးရာ',
    myOrders:           'ကျွနိုပ်၏အော်ဒါများ',
    changePassword:     'စကားဝှက်ပြောင်းရန်',
    privacyPolicy:      'ကိုယ်ရေးအချက်အလက်မူဝါဒ',
    termsConditions:    'စည်းကမ်းချက်များ',
    pdpa:               'ကိုယ်ရေးအချက်အလက် ကာကွယ်ရေးဥပဒေ',
    fullNamePlaceholder:    'နာမည်အပြည့်အစုံ',
    dobPlaceholder:         'မွေးသက္ကရာဇ်',
    currentPassword:        'လက်ရှိစကားဝှက်',
    newPassword:            'စကားဝှက်အသစ်',
    confirmNewPassword:     'စကားဝှက်အသစ်ကိုအတည်ပြုပါ',
    updatePassword:         'စကားဝှက်အသစ်ပြောင်းရန်',
    saveChanges:            'သိမ်းဆည်းမည်',
  },
} as const;

export function getProfileStrings(locale: Locale) {
  return PROFILE_STRINGS[locale];
}
