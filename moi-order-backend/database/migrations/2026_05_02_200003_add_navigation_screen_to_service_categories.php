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
        Schema::table('service_categories', function (Blueprint $table): void {
            $table->string('navigation_screen', 100)->nullable()->after('slug');
            $table->index('navigation_screen');
        });

        // Seed the existing embassy-letters category with its known screen key.
        DB::table('service_categories')
            ->where('slug', 'embassy-letters')
            ->update(['navigation_screen' => 'EmbassyServices']);
    }

    public function down(): void
    {
        Schema::table('service_categories', function (Blueprint $table): void {
            $table->dropIndex(['navigation_screen']);
            $table->dropColumn('navigation_screen');
        });
    }
};
