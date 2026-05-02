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
        Schema::table('service_types', function (Blueprint $table): void {
            $table->unsignedTinyInteger('position')->default(0)->after('service_id');
        });

        // Backfill: assign sequential positions per service, ordered by id
        $types = DB::table('service_types')
            ->whereNull('deleted_at')
            ->orderBy('id')
            ->get(['id', 'service_id']);

        $grouped = $types->groupBy('service_id');

        foreach ($grouped as $group) {
            foreach ($group->values() as $idx => $type) {
                DB::table('service_types')
                    ->where('id', $type->id)
                    ->update(['position' => $idx + 1]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('service_types', function (Blueprint $table): void {
            $table->dropColumn('position');
        });
    }
};
