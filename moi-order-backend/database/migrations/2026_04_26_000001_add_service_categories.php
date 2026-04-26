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
        Schema::create('service_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('name_en');
            $table->string('name_mm');
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('services', function (Blueprint $table): void {
            $table->foreignId('service_category_id')
                ->nullable()
                ->after('slug')
                ->constrained('service_categories')
                ->nullOnDelete();

            $table->index('service_category_id');
        });

        $categoryId = DB::table('service_categories')->insertGetId([
            'name'       => 'သံရုံးထောက်ခံစာများ',
            'name_en'    => 'Embassy Support Letters',
            'name_mm'    => 'သံရုံးထောက်ခံစာများ',
            'slug'       => 'embassy-letters',
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('services')
            ->whereIn('id', [5, 6, 7, 9])
            ->update(['service_category_id' => $categoryId]);
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table): void {
            $table->dropForeign(['service_category_id']);
            $table->dropIndex(['service_category_id']);
            $table->dropColumn('service_category_id');
        });

        Schema::dropIfExists('service_categories');
    }
};
