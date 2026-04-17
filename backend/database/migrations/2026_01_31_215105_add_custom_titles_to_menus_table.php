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
        Schema::table('menus', function (Blueprint $table) {
            $table->string('titulo_entradas')->default('ENTRADAS')->after('activo');
            $table->string('titulo_segundos')->default('SEGUNDOS')->after('titulo_entradas');
            $table->string('titulo_extras')->default('EXTRAS')->after('titulo_segundos');
            $table->string('titulo_bebidas')->default('BEBIDAS')->after('titulo_extras');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->dropColumn(['titulo_entradas', 'titulo_segundos', 'titulo_extras', 'titulo_bebidas']);
        });
    }
};
