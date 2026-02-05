<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Agregar soporte para Google OAuth sin afectar usuarios existentes
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Google-specific fields
            $table->string('google_id')->nullable()->unique()->after('password');
            $table->string('google_avatar_url')->nullable()->after('google_id');
            
            // Auth provider (email o google)
            $table->enum('auth_provider', ['email', 'google'])->default('email')->after('google_avatar_url');
            
            // Email verification timestamp
            $table->timestamp('email_verified_at')->nullable()->change(); // Asegura que puede ser null
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['google_id']);
            $table->dropColumn(['google_id', 'google_avatar_url', 'auth_provider']);
        });
    }
};
