<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('safety_locations', function (Blueprint $table): void {
            $table->integer('sort_order')->default(0)->after('id');
            $table->string('sub_category', 100)->nullable()->after('category');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::table('safety_locations', function (Blueprint $table): void {
            $table->dropIndex(['sort_order']);
            $table->dropColumn(['sort_order', 'sub_category']);
        });
    }
};
