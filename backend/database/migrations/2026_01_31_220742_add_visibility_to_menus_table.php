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
            $table->boolean('mostrar_entradas')->default(true)->after('titulo_bebidas');
            $table->boolean('mostrar_segundos')->default(true)->after('mostrar_entradas');
            $table->boolean('mostrar_extras')->default(true)->after('mostrar_segundos');
            $table->boolean('mostrar_bebidas')->default(true)->after('mostrar_extras');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->dropColumn(['mostrar_entradas', 'mostrar_segundos', 'mostrar_extras', 'mostrar_bebidas']);
        });
    }
};
