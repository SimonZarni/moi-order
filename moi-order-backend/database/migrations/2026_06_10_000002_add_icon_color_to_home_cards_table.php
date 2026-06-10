<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('home_cards', function (Blueprint $table): void {
            $table->string('icon_color', 20)->after('border_color')->default('#52796f');
        });
    }

    public function down(): void
    {
        Schema::table('home_cards', function (Blueprint $table): void {
            $table->dropColumn('icon_color');
        });
    }
};
