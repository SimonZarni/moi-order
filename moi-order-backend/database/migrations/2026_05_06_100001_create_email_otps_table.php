<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_otps', function (Blueprint $table): void {
            $table->id();
            $table->string('email');
            $table->string('otp');                            // bcrypt hash — never stored plain
            $table->string('purpose', 50);
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('expires_at');
            $table->timestamp('verified_at')->nullable();
            $table->uuid('verified_token')->nullable()->unique();
            $table->timestamp('verified_token_expires_at')->nullable();
            $table->timestamps();

            $table->index(['email', 'purpose']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_otps');
    }
};
