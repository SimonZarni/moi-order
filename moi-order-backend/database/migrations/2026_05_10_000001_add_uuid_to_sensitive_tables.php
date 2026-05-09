<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Adds an opaque UUID column to every route-exposed table that previously
 * used sequential integer IDs, closing the ID-enumeration vulnerability
 * (OWASP A05 — Security Misconfiguration / Information Disclosure).
 *
 * Strategy: keep integer PKs for all internal FK relationships (performance);
 * expose only the uuid on API responses and use it as the route key.
 *
 * Tables: users, payments, service_submissions, ticket_orders, food_orders, documents.
 */
return new class extends Migration
{
    private array $tables = [
        'users',
        'payments',
        'service_submissions',
        'ticket_orders',
        'food_orders',
        'documents',
    ];

    public function up(): void
    {
        // Step 1: add nullable column so existing rows don't violate NOT NULL yet.
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->uuid('uuid')->nullable()->unique()->after('id');
            });
        }

        // Step 2: backfill every existing row with a fresh UUID.
        foreach ($this->tables as $table) {
            DB::table($table)->orderBy('id')->chunkById(500, function ($rows) use ($table): void {
                foreach ($rows as $row) {
                    DB::table($table)
                        ->where('id', $row->id)
                        ->whereNull('uuid')
                        ->update(['uuid' => (string) Str::uuid()]);
                }
            });
        }

        // Step 3: make the column non-nullable (unique index already exists from step 1).
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->uuid('uuid')->nullable(false)->change();
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $t) use ($table) {
                $t->dropUnique("{$table}_uuid_unique");
                $t->dropColumn('uuid');
            });
        }
    }
};
