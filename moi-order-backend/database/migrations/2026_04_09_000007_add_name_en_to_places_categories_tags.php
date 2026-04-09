<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('name_en')->after('name_my');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->string('name_en')->after('name_my');
        });

        Schema::table('places', function (Blueprint $table) {
            $table->string('name_en')->after('name_my');
        });
    }

    public function down(): void
    {
        Schema::table('places', function (Blueprint $table) {
            $table->dropColumn('name_en');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->dropColumn('name_en');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('name_en');
        });
    }
};
