<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Option B migration step 2/3.
 * Copies text fields from the 8 hardcoded detail tables into
 * service_submissions.submission_data (JSON).
 *
 * Files remain in submission_documents — SubmissionDocumentResource continues
 * to serve them for existing submissions. Only text fields are migrated here.
 *
 * down() clears submission_data for rows whose detail record still exists,
 * restoring the original state. (Migration 3's down() recreates those tables
 * before this down() runs, making the check possible.)
 */
return new class extends Migration
{
    public function up(): void
    {
        // Simple services: full_name + phone only
        $simpleTableMap = [
            'ninety_day_report_details'            => ['full_name', 'phone'],
            'company_registration_details'          => ['full_name', 'phone'],
            'airport_fast_track_details'            => ['full_name', 'phone'],
            'embassy_residential_details'           => ['full_name', 'phone'],
            'embassy_car_license_details'           => ['full_name', 'phone'],
            'embassy_visa_recommendation_details'   => ['full_name', 'phone'],
            'test_service_details'                  => ['full_name', 'phone'],
        ];

        foreach ($simpleTableMap as $detailTable => $columns) {
            DB::table($detailTable)
                ->orderBy('id')
                ->chunk(200, function ($rows) use ($detailTable, $columns): void {
                    foreach ($rows as $row) {
                        $data = [];
                        foreach ($columns as $col) {
                            $data[$col] = $row->$col;
                        }
                        DB::table('service_submissions')
                            ->where('id', $row->submission_id)
                            ->update(['submission_data' => json_encode($data)]);
                    }
                });
        }

        // Embassy bank: full text fields (files stay in submission_documents)
        DB::table('embassy_bank_details')
            ->orderBy('id')
            ->chunk(200, function ($rows): void {
                foreach ($rows as $row) {
                    $data = [
                        'full_name'        => $row->full_name,
                        'passport_no'      => $row->passport_no,
                        'identity_card_no' => $row->identity_card_no,
                        'myanmar_address'  => $row->myanmar_address,
                        'thai_address'     => $row->thai_address,
                        'phone'            => $row->phone,
                        'bank_name'        => $row->bank_name,
                    ];

                    if ($row->current_job !== null) {
                        $data['current_job'] = $row->current_job;
                    }
                    if ($row->company !== null) {
                        $data['company'] = $row->company;
                    }

                    DB::table('service_submissions')
                        ->where('id', $row->submission_id)
                        ->update(['submission_data' => json_encode($data)]);
                }
            });
    }

    public function down(): void
    {
        // Clear submission_data only for submissions that have a detail row —
        // those rows were populated by up(). New dynamic submissions are unaffected.
        // Detail tables exist again at this point because Migration 3's down() runs first.
        $detailTables = [
            'ninety_day_report_details',
            'company_registration_details',
            'airport_fast_track_details',
            'embassy_residential_details',
            'embassy_car_license_details',
            'embassy_bank_details',
            'embassy_visa_recommendation_details',
            'test_service_details',
        ];

        foreach ($detailTables as $table) {
            $ids = DB::table($table)->pluck('submission_id')->all();

            if (empty($ids)) {
                continue;
            }

            DB::table('service_submissions')
                ->whereIn('id', $ids)
                ->update(['submission_data' => null]);
        }
    }
};
