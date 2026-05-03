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
            // Self-referential FK: group (parent) cards hold child service cards.
            // nullOnDelete so orphaning a child by deleting its parent is safe.
            $table->foreignId('parent_id')
                ->nullable()
                ->after('id')
                ->constrained('home_cards')
                ->nullOnDelete();

            // Parent group cards have no direct navigation target — their children do.
            $table->string('navigation_screen', 100)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('home_cards', function (Blueprint $table): void {
            $table->dropForeign(['parent_id']);
            $table->dropColumn('parent_id');
            $table->string('navigation_screen', 100)->nullable(false)->change();
        });
    }
};
