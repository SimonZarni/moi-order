import { DocumentType } from '@/types/enums';

export const DOCUMENT_LABELS: Record<DocumentType, { en: string; mm: string }> = {
  passport_bio_page:    { en: 'Passport Bio Page',                    mm: 'ပတ်စပို့ (ရှေ့မျက်နှာ)' },
  visa_page:            { en: 'Visa Page',                            mm: 'ဗီဇာ မျက်နှာ' },
  old_slip:             { en: 'Previous 90-Day Slip',                 mm: 'ရက် ၉၀ စလစ်အဟောင်း' },
  identity_card_front:  { en: 'Identity Card (Front)',                mm: 'မှတ်ပုံတင် (အရှေ့)' },
  identity_card_back:   { en: 'Identity Card (Back)',                 mm: 'မှတ်ပုံတင် (အနောက်)' },
  tm30:                 { en: 'TM30',                                 mm: 'TM30' },
  upper_body_photo:     { en: 'Upper Body Photo',                     mm: 'ကိုယ်တစ်ပိုင်းပုံ (လာမည့်နေ့ ဝတ်ဆင်လာမည့် ပုံစံ)' },
  airplane_ticket:      { en: 'Airplane Ticket',                      mm: 'လေယာဉ်လက်မှတ်' },
  passport_size_photo:  { en: 'Passport Size Photo',                  mm: 'ပတ်စပို့ ဓါတ်ပုံ (1.5" x 1.5")' },
  test_photo:           { en: 'Test Photo',                           mm: 'Test Photo' },
};
