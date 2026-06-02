<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket_variants', function (Blueprint $table): void {
            $table->renameColumn('price', 'adult_price');
        });

        Schema::table('ticket_variants', function (Blueprint $table): void {
            $table->bigInteger('child_price')->unsigned()->nullable()->after('adult_price');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_variants', function (Blueprint $table): void {
            $table->dropColumn('child_price');
        });

        Schema::table('ticket_variants', function (Blueprint $table): void {
            $table->renameColumn('adult_price', 'price');
        });
    }
};
