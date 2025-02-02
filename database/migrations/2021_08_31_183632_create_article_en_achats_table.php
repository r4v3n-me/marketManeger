<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArticleEnAchatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('article_en_achats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('achat_id');
            $table->foreignId('article_id');
            $table->double('price');
            $table->integer('quantity');
            $table->integer('livred_quantity')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('article_en_achats');
    }
}
