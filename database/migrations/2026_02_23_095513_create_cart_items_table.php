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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('cart_id');
            $table->integer('product_id')->index('fk_product');
            $table->integer('quantity')->default(1);
            $table->timestamp('added_at')->nullable()->useCurrent();

            $table->unique(['cart_id', 'product_id'], 'unique_cart_product');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
