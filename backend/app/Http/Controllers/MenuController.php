<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\ItemMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class MenuController extends Controller
{
    /**
     * Listar todos los menús del usuario autenticado
     */
    public function index(Request $request)
    {
        $menus = Menu::where('usuario_id', $request->user()->id)
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'menus' => $menus,
        ]);
    }

    /**
     * Crear un nuevo menú con sus items
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'imagen_fondo' => 'nullable|string',
            'imagen_fondo_tipo' => 'nullable|in:default,custom',
            'items' => 'required|array|min:1',
            'items.*.categoria' => 'required|in:entrada,segundo,extra,bebida',
            'items.*.nombre' => 'required|string|max:255',
            'items.*.orden' => 'nullable|integer',
            'titulo_entradas' => 'nullable|string|max:50',
            'titulo_segundos' => 'nullable|string|max:50',
            'titulo_extras' => 'nullable|string|max:50',
            'titulo_bebidas' => 'nullable|string|max:50',
            'mostrar_entradas' => 'nullable|boolean',
            'mostrar_segundos' => 'nullable|boolean',
            'mostrar_extras' => 'nullable|boolean',
            'mostrar_bebidas' => 'nullable|boolean',
            'posiciones' => 'nullable|array',
        ]);

        DB::beginTransaction();

        try {
            $data = $request->only([
                'nombre', 'precio', 'imagen_fondo', 'imagen_fondo_tipo',
                'titulo_entradas', 'titulo_segundos', 'titulo_extras', 'titulo_bebidas',
                'mostrar_entradas', 'mostrar_segundos', 'mostrar_extras', 'mostrar_bebidas',
                'posiciones'
            ]);
            
            $data['usuario_id'] = $request->user()->id;
            $data['imagen_fondo_tipo'] = $request->imagen_fondo_tipo ?? 'default';
            $data['activo'] = true;

            // Defaults para visibilidad si no vienen
            $data['mostrar_entradas'] = $request->input('mostrar_entradas', true);
            $data['mostrar_segundos'] = $request->input('mostrar_segundos', true);
            $data['mostrar_extras'] = $request->input('mostrar_extras', true);
            $data['mostrar_bebidas'] = $request->input('mostrar_bebidas', true);

            $menu = Menu::create($data);

            foreach ($request->items as $itemData) {
                ItemMenu::create([
                    'menu_id' => $menu->id,
                    'categoria' => $itemData['categoria'],
                    'nombre' => $itemData['nombre'],
                    'orden' => $itemData['orden'] ?? 0,
                ]);
            }

            $menu->load('items');

            DB::commit();

            return response()->json([
                'mensaje' => 'Menú creado exitosamente',
                'menu' => $menu,
                'url_publica' => $menu->obtenerUrlPublica(),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'mensaje' => 'Error al crear el menú',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mostrar un menú específico
     */
    public function show(Request $request, $id)
    {
        $menu = Menu::where('id', $id)
            ->where('usuario_id', $request->user()->id)
            ->with('items')
            ->firstOrFail();

        return response()->json([
            'menu' => $menu,
            'url_publica' => $menu->obtenerUrlPublica(),
        ]);
    }

    /**
     * Actualizar un menú
     */
    public function update(Request $request, $id)
    {
        $menu = Menu::where('id', $id)
            ->where('usuario_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'precio' => 'sometimes|required|numeric|min:0',
            'imagen_fondo' => 'nullable|string',
            'imagen_fondo_tipo' => 'nullable|in:default,custom',
            'items' => 'sometimes|array',
            'items.*.categoria' => 'required_with:items|in:entrada,segundo,extra,bebida',
            'items.*.nombre' => 'required_with:items|string|max:255',
            'items.*.orden' => 'nullable|integer',
            'titulo_entradas' => 'nullable|string|max:50',
            'titulo_segundos' => 'nullable|string|max:50',
            'titulo_extras' => 'nullable|string|max:50',
            'titulo_bebidas' => 'nullable|string|max:50',
            'mostrar_entradas' => 'nullable|boolean',
            'mostrar_segundos' => 'nullable|boolean',
            'mostrar_extras' => 'nullable|boolean',
            'mostrar_bebidas' => 'nullable|boolean',
            'posiciones' => 'nullable|array',
        ]);

        DB::beginTransaction();

        try {
            $menu->update($request->only([
                'nombre', 'precio', 'imagen_fondo', 'imagen_fondo_tipo',
                'titulo_entradas', 'titulo_segundos', 'titulo_extras', 'titulo_bebidas',
                'mostrar_entradas', 'mostrar_segundos', 'mostrar_extras', 'mostrar_bebidas',
                'posiciones'
            ]));

            if ($request->has('items')) {
                // Eliminar items existentes
                $menu->items()->delete();

                // Crear nuevos items
                foreach ($request->items as $itemData) {
                    ItemMenu::create([
                        'menu_id' => $menu->id,
                        'categoria' => $itemData['categoria'],
                        'nombre' => $itemData['nombre'],
                        'orden' => $itemData['orden'] ?? 0,
                    ]);
                }
            }

            $menu->load('items');

            DB::commit();

            return response()->json([
                'mensaje' => 'Menú actualizado exitosamente',
                'menu' => $menu,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'mensaje' => 'Error al actualizar el menú',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar un menú
     */
    public function destroy(Request $request, $id)
    {
        $menu = Menu::where('id', $id)
            ->where('usuario_id', $request->user()->id)
            ->firstOrFail();

        // Eliminar items explícitamente para asegurar que no haya error de FK
        $menu->items()->delete();
        $menu->delete();

        return response()->json([
            'mensaje' => 'Menú eliminado exitosamente',
        ]);
    }

    /**
     * Generar código QR del menú
     */
    public function generarQR(Request $request, $id)
    {
        $menu = Menu::where('id', $id)
            ->where('usuario_id', $request->user()->id)
            ->firstOrFail();

        $urlPublica = $menu->obtenerUrlPublica();

        // Generar QR en formato SVG
        $renderer = new ImageRenderer(
            new RendererStyle(300),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $qrCode = $writer->writeString($urlPublica);

        return response($qrCode)
            ->header('Content-Type', 'image/svg+xml');
    }

    /**
     * Activar o desactivar un menú
     */
    public function activarDesactivar(Request $request, $id)
    {
        $menu = Menu::where('id', $id)
            ->where('usuario_id', $request->user()->id)
            ->firstOrFail();

        $menu->activo = !$menu->activo;
        $menu->save();

        return response()->json([
            'mensaje' => $menu->activo ? 'Menú activado' : 'Menú desactivado',
            'activo' => $menu->activo,
        ]);
    }

    /**
     * Ver menú público (sin autenticación)
     */
    public function verPublico($codigo)
    {
        $menu = Menu::where('codigo_unico', $codigo)
            ->where('activo', true)
            ->with('items')
            ->first();

        if (!$menu) {
           return response()->json([
                'mensaje' => 'Menú no encontrado o no está disponible',
            ], 404);
        }

        return response()->json([
            'menu' => $menu,
        ]);
    }

    /**
     * Subir imagen de fondo personalizada
     */
    public function subirImagen(Request $request)
    {
        $request->validate([
            'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('fondos-menu', 'public');

            return response()->json([
                'mensaje' => 'Imagen subida exitosamente',
                'ruta' => Storage::url($path),
            ]);
        }

        return response()->json([
            'mensaje' => 'No se pudo subir la imagen',
        ], 400);
    }
}
