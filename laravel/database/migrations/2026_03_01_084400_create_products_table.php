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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('sku')->unique();
            $table->string('name');
            $table->text('description')->nullable();

            $table->decimal('price', 10, 2);
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();

            $table->integer('stock_quantity')->default(0);

            $table->text('images')->nullable();
            $table->text('sizes')->nullable();
            $table->text('colors')->nullable();

            $table->string('status')->default('active')->index();
            $table->timestamp('scraped_at')->nullable();

            $table->text('source_url')->nullable();
            $table->string('grade')->nullable();
            $table->string('shopify_id')->nullable();
            $table->string('product_type')->nullable();
            $table->text('tags')->nullable();
            $table->string('vendor')->nullable();

            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->integer('discount_percent')->nullable();
            $table->boolean('featured')->default(false)->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
