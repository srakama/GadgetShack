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
        Schema::create('payment_notifications', function (Blueprint $table) {
            $table->id();

            $table->string('provider')->index();
            $table->unsignedBigInteger('order_id')->nullable()->index();
            $table->string('event_type')->nullable()->index();

            $table->boolean('verified')->default(false)->index();
            $table->string('status')->nullable()->index();
            $table->string('reference')->nullable()->index();

            $table->string('remote_ip')->nullable();
            $table->json('payload');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_notifications');
    }
};
