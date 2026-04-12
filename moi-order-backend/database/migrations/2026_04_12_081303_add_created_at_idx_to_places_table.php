<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Performance: PlaceController::index() runs:
//   SELECT * FROM places WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 20
// Without a created_at index MySQL must scan and sort all non-deleted rows.
// Adding the index lets MySQL resolve ORDER BY directly from the index.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('places', function (Blueprint $table): void {
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('places', function (Blueprint $table): void {
            $table->dropIndex(['created_at']);
        });
    }
};
