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
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('phone')->nullable()->after('last_name');

            $table->string('address')->nullable()->after('phone');
            $table->string('city')->nullable()->after('address');
            $table->string('province')->nullable()->after('city');
            $table->string('postal_code')->nullable()->after('province');

            $table->string('role')->default('customer')->after('postal_code');

            $table->string('oauth_provider')->nullable()->after('role');
            $table->string('oauth_id')->nullable()->after('oauth_provider');
            $table->text('profile_picture')->nullable()->after('oauth_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'phone',
                'address',
                'city',
                'province',
                'postal_code',
                'role',
                'oauth_provider',
                'oauth_id',
                'profile_picture',
            ]);
        });
    }
};
