<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Offsets para la conversión
$offsets = [
    'precio' => 65,
    'entradas' => 30,
    'segundos' => 30,
    'extras' => 30,
    'bebidas' => 30,
];

$menus = DB::table('menus')->whereNotNull('posiciones')->get();
$updated_count = 0;

foreach ($menus as $menu) {
    $posiciones = json_decode($menu->posiciones, true);
    
    if (!$posiciones || !is_array($posiciones)) {
        continue;
    }

    $updated = false;

    foreach ($offsets as $key => $offset) {
        if (isset($posiciones[$key]) && isset($posiciones[$key]['y'])) {
            $old_y = $posiciones[$key]['y'];
            $new_y = max(0, $old_y - $offset);
            $posiciones[$key]['y'] = $new_y;
            $updated = true;
            echo "Menu #{$menu->id}: {$key} y={$old_y} → y={$new_y}\n";
        }
    }

    if ($updated) {
        DB::table('menus')
            ->where('id', $menu->id)
            ->update(['posiciones' => json_encode($posiciones)]);
        $updated_count++;
    }
}

echo "\n✅ Migración completada: {$updated_count} menús actualizados\n";
