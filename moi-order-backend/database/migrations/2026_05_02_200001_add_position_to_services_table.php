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
        Schema::table('services', function (Blueprint $table): void {
            $table->unsignedTinyInteger('position')->default(0)->after('service_category_id');
        });

        // Backfill: assign sequential positions per category group, ordered by id
        $services = DB::table('services')
            ->whereNull('deleted_at')
            ->orderBy('id')
            ->get(['id', 'service_category_id']);

        $grouped = $services->groupBy('service_category_id');

        foreach ($grouped as $group) {
            foreach ($group->values() as $idx => $service) {
                DB::table('services')
                    ->where('id', $service->id)
                    ->update(['position' => $idx + 1]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table): void {
            $table->dropColumn('position');
        });
    }
};
