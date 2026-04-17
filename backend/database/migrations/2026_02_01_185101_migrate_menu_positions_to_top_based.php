<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * MIGRACIÓN DE SISTEMA DE COORDENADAS:
     * Convierte posiciones de baseline-based a top-based
     * 
     * SISTEMA ANTIGUO: pos.y = baseline del texto / centro del círculo
     * SISTEMA NUEVO: pos.y = top del elemento
     *
     * @return void
     */
    public function up()
    {
        // Offsets para convertir de baseline a top
        $offsets = [
            'precio' => 65,    // Círculo: top = center - radius (~65px)
            'entradas' => 30,  // Título: top = baseline - 30px
            'segundos' => 30,
            'extras' => 30,
            'bebidas' => 30,
        ];

        $menus = DB::table('menus')->whereNotNull('posiciones')->get();

        foreach ($menus as $menu) {
            $posiciones = json_decode($menu->posiciones, true);
            
            if (!$posiciones || !is_array($posiciones)) {
                continue;
            }

            $updated = false;

            foreach ($offsets as $key => $offset) {
                if (isset($posiciones[$key]) && isset($posiciones[$key]['y'])) {
                    // Convertir: new_y = old_y - offset
                    $oldY = $posiciones[$key]['y'];
                    $newY = max(0, $oldY - $offset);
                    $posiciones[$key]['y'] = $newY;
                    $updated = true;
                }
            }

            if ($updated) {
                DB::table('menus')
                    ->where('id', $menu->id)
                    ->update(['posiciones' => json_encode($posiciones)]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Offsets para revertir de top a baseline
        $offsets = [
            'precio' => 65,
            'entradas' => 30,
            'segundos' => 30,
            'extras' => 30,
            'bebidas' => 30,
        ];

        $menus = DB::table('menus')->whereNotNull('posiciones')->get();

        foreach ($menus as $menu) {
            $posiciones = json_decode($menu->posiciones, true);
            
            if (!$posiciones || !is_array($posiciones)) {
                continue;
            }

            $updated = false;

            foreach ($offsets as $key => $offset) {
                if (isset($posiciones[$key]) && isset($posiciones[$key]['y'])) {
                    // Revertir: old_y = new_y + offset
                    $posiciones[$key]['y'] += $offset;
                    $updated = true;
                }
            }

            if ($updated) {
                DB::table('menus')
                    ->where('id', $menu->id)
                    ->update(['posiciones' => json_encode($posiciones)]);
            }
        }
    }
};
