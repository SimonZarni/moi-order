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
        Schema::table('ticket_order_items', function (Blueprint $table): void {
            $table->string('person_type', 10)->default('general')->after('price_snapshot');
            $table->index('person_type');
        });

        DB::statement(
            "ALTER TABLE ticket_order_items ADD CONSTRAINT chk_toi_person_type CHECK (person_type IN ('adult','child','general'))"
        );
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE ticket_order_items DROP CONSTRAINT chk_toi_person_type');

        Schema::table('ticket_order_items', function (Blueprint $table): void {
            $table->dropIndex(['person_type']);
            $table->dropColumn('person_type');
        });
    }
};
