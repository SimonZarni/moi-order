<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_types', function (Blueprint $table): void {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('name_en', 255);
            $table->string('name_mm', 255)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes()->index();
        });

        // Seed all existing enum values so existing data and field_schema references remain valid.
        DB::table('document_types')->insert([
            ['slug' => 'passport_bio_page',   'name_en' => 'Passport Bio Page',          'name_mm' => 'ပတ်စပို့ (ရှေ့မျက်နှာ)',                              'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'visa_page',           'name_en' => 'Visa Page',                  'name_mm' => 'ဗီဇာ မျက်နှာ',                                        'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'old_slip',            'name_en' => 'Old 90-Day Report Slip',     'name_mm' => 'ရက် ၉၀ စလစ်အဟောင်း',                                  'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'identity_card_front', 'name_en' => 'Identity Card (Front)',      'name_mm' => 'မှတ်ပုံတင် (အရှေ့)',                                    'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'identity_card_back',  'name_en' => 'Identity Card (Back)',       'name_mm' => 'မှတ်ပုံတင် (အနောက်)',                                  'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'tm30',                'name_en' => 'TM30',                       'name_mm' => 'TM30',                                                 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'upper_body_photo',    'name_en' => 'Upper Half Body Photo',      'name_mm' => 'ကိုယ်တစ်ပိုင်းပုံ (လာမည့်နေ့ ဝတ်ဆင်လာမည့် ပုံစံ)', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'airplane_ticket',     'name_en' => 'Airplane Ticket',            'name_mm' => 'လေယာဉ်လက်မှတ်',                                       'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'passport_size_photo', 'name_en' => 'Passport Size Photo',        'name_mm' => 'ပတ်စပို့ ဓါတ်ပုံ (1.5" x 1.5")',                     'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'test_photo',          'name_en' => 'Test Photo',                 'name_mm' => 'Test Photo',                                           'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('document_types');
    }
};
