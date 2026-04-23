<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->unique('name_en', 'categories_name_en_unique');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->unique('name_en', 'tags_name_en_unique');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropUnique('categories_name_en_unique');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->dropUnique('tags_name_en_unique');
        });
    }
};
