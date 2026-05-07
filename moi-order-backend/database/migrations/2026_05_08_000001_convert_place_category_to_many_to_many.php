<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Converts place–category from one-to-many (category_id FK on places)
 * to many-to-many (category_place pivot table).
 *
 * up()  : create pivot → copy existing assignments → drop column.
 * down(): re-add nullable column → restore first category per place → drop pivot.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category_place', function (Blueprint $table): void {
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('place_id')->constrained()->cascadeOnDelete();
            $table->primary(['category_id', 'place_id']);
        });

        // Copy every existing single-category assignment into the pivot.
        DB::statement('
            INSERT INTO category_place (category_id, place_id)
            SELECT category_id, id
            FROM places
            WHERE category_id IS NOT NULL
        ');

        Schema::table('places', function (Blueprint $table): void {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }

    public function down(): void
    {
        Schema::table('places', function (Blueprint $table): void {
            $table->foreignId('category_id')
                ->nullable()
                ->after('id')
                ->constrained()
                ->nullOnDelete();
        });

        // Restore the first category per place from the pivot.
        DB::statement('
            UPDATE places p
            INNER JOIN (
                SELECT place_id, MIN(category_id) AS category_id
                FROM category_place
                GROUP BY place_id
            ) cp ON cp.place_id = p.id
            SET p.category_id = cp.category_id
        ');

        Schema::dropIfExists('category_place');
    }
};
