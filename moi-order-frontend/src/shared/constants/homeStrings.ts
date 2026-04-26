import { Locale } from '@/shared/store/localeStore';

const HOME_STRINGS = {
  en: {
    ourServices:          'Our Services',
    ninetyDayReport:      '90-Day Report',
    tickets:              'Tickets',
    themeParks:           'Theme parks & more',
    places:               'Places',
    attractionsLandmarks: 'Attractions & Landmarks',
    otherServices:        'Other Services',
    companyMore:          'Company & more',
    embassyServices:      'သံရုံးထောက်ခံစာများ',
    embassyMore:          'Support letters & more',
    airportFastTrack:     'Airport Fast Track',
    airportSubtitle:      'Priority airport service',
  },
  mm: {
    ourServices:          '၀န်ဆောင်မှုများ',
    ninetyDayReport:      'ရက် ၉၀ တုံး',
    tickets:              'လက်မှတ်များ',
    themeParks:           'ကစားကွင်းများနှင့် အခြားကဏ္ဍများ',
    places:               'နေရာများ',
    attractionsLandmarks: 'လည်ပတ်စရာများနှင့် ထင်ရှားသောနေရာများ',
    otherServices:        'အခြား၀န်ဆောင်မှုများ',
    companyMore:          'ကုမ္ပဏီနှင့် အခြားအချက်အလက်များ',
    embassyServices:      'သံရုံးထောက်ခံစာများ',
    embassyMore:          'ထောက်ခံစာများနှင့် အခြားကဏ္ဍများ',
    airportFastTrack:     'Airport Fast Track',
    airportSubtitle:      'လေဆိပ် အထူး၀န်ဆောင်မှု',
  },
} as const;

export function getHomeStrings(locale: Locale) {
  return HOME_STRINGS[locale];
}
