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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()->index();

            $table->string('status')->default('pending')->index();
            $table->string('payment_status')->default('pending')->index();
            $table->string('payment_intent_id')->nullable();

            $table->decimal('total_amount', 10, 2);

            $table->text('shipping_address')->nullable();
            $table->text('billing_address')->nullable();

            $table->string('tracking_number')->nullable()->index();
            $table->string('shipping_provider')->nullable();
            $table->string('shipping_service')->nullable();
            $table->decimal('shipping_cost', 10, 2)->nullable();
            $table->string('shipping_status')->nullable()->index();
            $table->string('shipping_location')->nullable();
            $table->date('estimated_delivery')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
