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
        Schema::table('home_cards', function (Blueprint $table): void {
            $table->string('border_color', 20)->after('accent_color')->default('#52796f');
        });

        // Preserve existing appearance: seed border_color from accent_color for all rows.
        DB::statement('UPDATE home_cards SET border_color = accent_color');
    }

    public function down(): void
    {
        Schema::table('home_cards', function (Blueprint $table): void {
            $table->dropColumn('border_color');
        });
    }
};
