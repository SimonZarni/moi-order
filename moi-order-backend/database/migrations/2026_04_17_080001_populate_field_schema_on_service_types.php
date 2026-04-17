<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Option B migration step 1/3.
 * Populates field_schema on all existing service_types so every submission
 * can be processed through the unified dynamic flow.
 *
 * Keyed by service slug → safe even if IDs differ between environments.
 * down() sets all field_schema back to NULL (no data loss — original
 * detail tables are restored by step 3/3's down()).
 */
return new class extends Migration
{
    /** @var array<string, list<array<string,mixed>>> */
    private array $schemas = [
        '90-day-report' => [
            ['key' => 'full_name',        'label' => 'ชื่อ-นามสกุล',            'label_en' => 'Full Name',               'type' => 'text',  'required' => true,  'sort_order' => 1],
            ['key' => 'phone',            'label' => 'เบอร์โทรศัพท์',           'label_en' => 'Phone Number',            'type' => 'phone', 'required' => true,  'sort_order' => 2],
            ['key' => 'passport_bio_page','label' => 'หน้าข้อมูลพาสปอร์ต',    'label_en' => 'Passport Bio Page',       'type' => 'file',  'required' => true,  'sort_order' => 3, 'accepts' => ['image']],
            ['key' => 'visa_page',        'label' => 'หน้าวีซ่า',              'label_en' => 'Visa Page',               'type' => 'file',  'required' => true,  'sort_order' => 4, 'accepts' => ['image']],
            ['key' => 'old_slip',         'label' => 'สลิปรายงานตัว 90 วันเดิม','label_en' => 'Old 90-Day Report Slip', 'type' => 'file',  'required' => true,  'sort_order' => 5, 'accepts' => ['image']],
        ],

        'company-registration' => [
            ['key' => 'full_name',           'label' => 'ชื่อ-นามสกุล',           'label_en' => 'Full Name',          'type' => 'text',  'required' => true, 'sort_order' => 1],
            ['key' => 'phone',               'label' => 'เบอร์โทรศัพท์',          'label_en' => 'Phone Number',       'type' => 'phone', 'required' => true, 'sort_order' => 2],
            ['key' => 'passport_bio_page',   'label' => 'หน้าข้อมูลพาสปอร์ต',   'label_en' => 'Passport Bio Page',  'type' => 'file',  'required' => true, 'sort_order' => 3, 'accepts' => ['image']],
            ['key' => 'visa_page',           'label' => 'หน้าวีซ่า',             'label_en' => 'Visa Page',          'type' => 'file',  'required' => true, 'sort_order' => 4, 'accepts' => ['image']],
            ['key' => 'identity_card_front', 'label' => 'บัตรประชาชน (ด้านหน้า)','label_en' => 'Identity Card Front','type' => 'file',  'required' => true, 'sort_order' => 5, 'accepts' => ['image']],
            ['key' => 'identity_card_back',  'label' => 'บัตรประชาชน (ด้านหลัง)','label_en' => 'Identity Card Back', 'type' => 'file',  'required' => true, 'sort_order' => 6, 'accepts' => ['image']],
            ['key' => 'tm30',                'label' => 'TM30',                   'label_en' => 'TM30',               'type' => 'file',  'required' => true, 'sort_order' => 7, 'accepts' => ['image']],
        ],

        'airport-fast-track' => [
            ['key' => 'full_name',        'label' => 'ชื่อ-นามสกุล',     'label_en' => 'Full Name',        'type' => 'text',  'required' => true, 'sort_order' => 1],
            ['key' => 'phone',            'label' => 'เบอร์โทรศัพท์',    'label_en' => 'Phone Number',     'type' => 'phone', 'required' => true, 'sort_order' => 2],
            ['key' => 'upper_body_photo', 'label' => 'รูปถ่ายครึ่งตัว', 'label_en' => 'Upper Body Photo', 'type' => 'file',  'required' => true, 'sort_order' => 3, 'accepts' => ['image']],
            ['key' => 'airplane_ticket',  'label' => 'ตั๋วเครื่องบิน',  'label_en' => 'Airplane Ticket',  'type' => 'file',  'required' => true, 'sort_order' => 4, 'accepts' => ['image', 'pdf']],
        ],

        'embassy-residential-service' => [
            ['key' => 'full_name',           'label' => 'ชื่อ-นามสกุล',           'label_en' => 'Full Name',          'type' => 'text',  'required' => true, 'sort_order' => 1],
            ['key' => 'phone',               'label' => 'เบอร์โทรศัพท์',          'label_en' => 'Phone Number',       'type' => 'phone', 'required' => true, 'sort_order' => 2],
            ['key' => 'passport_bio_page',   'label' => 'หน้าข้อมูลพาสปอร์ต',   'label_en' => 'Passport Bio Page',  'type' => 'file',  'required' => true, 'sort_order' => 3, 'accepts' => ['image']],
            ['key' => 'visa_page',           'label' => 'หน้าวีซ่า',             'label_en' => 'Visa Page',          'type' => 'file',  'required' => true, 'sort_order' => 4, 'accepts' => ['image']],
            ['key' => 'identity_card_front', 'label' => 'บัตรประชาชน (ด้านหน้า)','label_en' => 'Identity Card Front','type' => 'file',  'required' => true, 'sort_order' => 5, 'accepts' => ['image']],
            ['key' => 'identity_card_back',  'label' => 'บัตรประชาชน (ด้านหลัง)','label_en' => 'Identity Card Back', 'type' => 'file',  'required' => true, 'sort_order' => 6, 'accepts' => ['image']],
            ['key' => 'tm30',                'label' => 'TM30',                   'label_en' => 'TM30',               'type' => 'file',  'required' => true, 'sort_order' => 7, 'accepts' => ['image', 'pdf']],
        ],

        'embassy-car-license' => [
            ['key' => 'full_name',           'label' => 'ชื่อ-นามสกุล',           'label_en' => 'Full Name',          'type' => 'text',  'required' => true, 'sort_order' => 1],
            ['key' => 'phone',               'label' => 'เบอร์โทรศัพท์',          'label_en' => 'Phone Number',       'type' => 'phone', 'required' => true, 'sort_order' => 2],
            ['key' => 'passport_bio_page',   'label' => 'หน้าข้อมูลพาสปอร์ต',   'label_en' => 'Passport Bio Page',  'type' => 'file',  'required' => true, 'sort_order' => 3, 'accepts' => ['image']],
            ['key' => 'visa_page',           'label' => 'หน้าวีซ่า',             'label_en' => 'Visa Page',          'type' => 'file',  'required' => true, 'sort_order' => 4, 'accepts' => ['image']],
            ['key' => 'identity_card_front', 'label' => 'บัตรประชาชน (ด้านหน้า)','label_en' => 'Identity Card Front','type' => 'file',  'required' => true, 'sort_order' => 5, 'accepts' => ['image']],
            ['key' => 'identity_card_back',  'label' => 'บัตรประชาชน (ด้านหลัง)','label_en' => 'Identity Card Back', 'type' => 'file',  'required' => true, 'sort_order' => 6, 'accepts' => ['image']],
            ['key' => 'tm30',                'label' => 'TM30',                   'label_en' => 'TM30',               'type' => 'file',  'required' => true, 'sort_order' => 7, 'accepts' => ['image', 'pdf']],
        ],

        'embassy-bank-service' => [
            ['key' => 'full_name',           'label' => 'ชื่อ-นามสกุล',           'label_en' => 'Full Name',            'type' => 'text',     'required' => true,  'sort_order' => 1],
            ['key' => 'passport_no',         'label' => 'หมายเลขพาสปอร์ต',        'label_en' => 'Passport Number',      'type' => 'text',     'required' => true,  'sort_order' => 2],
            ['key' => 'identity_card_no',    'label' => 'หมายเลขบัตรประชาชน',     'label_en' => 'Identity Card Number', 'type' => 'text',     'required' => true,  'sort_order' => 3],
            ['key' => 'current_job',         'label' => 'อาชีพปัจจุบัน',          'label_en' => 'Current Job',          'type' => 'text',     'required' => false, 'sort_order' => 4],
            ['key' => 'company',             'label' => 'บริษัท/นายจ้าง',         'label_en' => 'Company',              'type' => 'text',     'required' => false, 'sort_order' => 5],
            ['key' => 'myanmar_address',     'label' => 'ที่อยู่ในเมียนมาร์',     'label_en' => 'Myanmar Address',      'type' => 'textarea', 'required' => true,  'sort_order' => 6],
            ['key' => 'thai_address',        'label' => 'ที่อยู่ในประเทศไทย',     'label_en' => 'Thai Address',         'type' => 'textarea', 'required' => true,  'sort_order' => 7],
            ['key' => 'phone',               'label' => 'เบอร์โทรศัพท์',          'label_en' => 'Phone Number',         'type' => 'phone',    'required' => true,  'sort_order' => 8],
            ['key' => 'bank_name',           'label' => 'ชื่อธนาคาร',             'label_en' => 'Bank Name',            'type' => 'text',     'required' => true,  'sort_order' => 9],
            ['key' => 'passport_size_photo', 'label' => 'รูปถ่ายขนาดพาสปอร์ต',   'label_en' => 'Passport Size Photo',  'type' => 'file',     'required' => true,  'sort_order' => 10, 'accepts' => ['image']],
            ['key' => 'passport_bio_page',   'label' => 'หน้าข้อมูลพาสปอร์ต',   'label_en' => 'Passport Bio Page',    'type' => 'file',     'required' => true,  'sort_order' => 11, 'accepts' => ['image']],
            ['key' => 'visa_page',           'label' => 'หน้าวีซ่า',             'label_en' => 'Visa Page',            'type' => 'file',     'required' => true,  'sort_order' => 12, 'accepts' => ['image']],
            ['key' => 'identity_card_front', 'label' => 'บัตรประชาชน (ด้านหน้า)','label_en' => 'Identity Card Front',  'type' => 'file',     'required' => true,  'sort_order' => 13, 'accepts' => ['image']],
            ['key' => 'identity_card_back',  'label' => 'บัตรประชาชน (ด้านหลัง)','label_en' => 'Identity Card Back',   'type' => 'file',     'required' => true,  'sort_order' => 14, 'accepts' => ['image']],
            ['key' => 'tm30',                'label' => 'TM30',                   'label_en' => 'TM30',                 'type' => 'file',     'required' => true,  'sort_order' => 15, 'accepts' => ['image', 'pdf']],
        ],

        'embassy-visa-recommendation' => [
            ['key' => 'full_name',           'label' => 'ชื่อ-นามสกุล',           'label_en' => 'Full Name',          'type' => 'text',  'required' => true, 'sort_order' => 1],
            ['key' => 'phone',               'label' => 'เบอร์โทรศัพท์',          'label_en' => 'Phone Number',       'type' => 'phone', 'required' => true, 'sort_order' => 2],
            ['key' => 'passport_bio_page',   'label' => 'หน้าข้อมูลพาสปอร์ต',   'label_en' => 'Passport Bio Page',  'type' => 'file',  'required' => true, 'sort_order' => 3, 'accepts' => ['image']],
            ['key' => 'visa_page',           'label' => 'หน้าวีซ่า',             'label_en' => 'Visa Page',          'type' => 'file',  'required' => true, 'sort_order' => 4, 'accepts' => ['image']],
            ['key' => 'identity_card_front', 'label' => 'บัตรประชาชน (ด้านหน้า)','label_en' => 'Identity Card Front','type' => 'file',  'required' => true, 'sort_order' => 5, 'accepts' => ['image']],
            ['key' => 'identity_card_back',  'label' => 'บัตรประชาชน (ด้านหลัง)','label_en' => 'Identity Card Back', 'type' => 'file',  'required' => true, 'sort_order' => 6, 'accepts' => ['image']],
        ],

        'test-service' => [
            ['key' => 'full_name', 'label' => 'ชื่อ-นามสกุล',  'label_en' => 'Full Name',    'type' => 'text',  'required' => true, 'sort_order' => 1],
            ['key' => 'phone',     'label' => 'เบอร์โทรศัพท์', 'label_en' => 'Phone Number', 'type' => 'phone', 'required' => true, 'sort_order' => 2],
        ],
    ];

    public function up(): void
    {
        foreach ($this->schemas as $serviceSlug => $schema) {
            $serviceId = DB::table('services')
                ->where('slug', $serviceSlug)
                ->value('id');

            if ($serviceId === null) {
                continue; // service not seeded in this environment
            }

            DB::table('service_types')
                ->where('service_id', $serviceId)
                ->update(['field_schema' => json_encode($schema)]);
        }
    }

    public function down(): void
    {
        foreach (array_keys($this->schemas) as $serviceSlug) {
            $serviceId = DB::table('services')
                ->where('slug', $serviceSlug)
                ->value('id');

            if ($serviceId === null) {
                continue;
            }

            DB::table('service_types')
                ->where('service_id', $serviceId)
                ->update(['field_schema' => null]);
        }
    }
};
