<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Menu extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'menus';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'usuario_id',
        'nombre',
        'precio',
        'imagen_fondo',
        'imagen_fondo_tipo',
        'activo',
        'titulo_entradas',
        'titulo_segundos',
        'titulo_extras',
        'titulo_bebidas',
        'mostrar_entradas',
        'mostrar_segundos',
        'mostrar_extras',
        'mostrar_bebidas',
        'posiciones',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'precio' => 'decimal:2',
        'activo' => 'boolean',
        'mostrar_entradas' => 'boolean',
        'mostrar_segundos' => 'boolean',
        'mostrar_extras' => 'boolean',
        'mostrar_bebidas' => 'boolean',
        'posiciones' => 'array',
    ];

    /**
     * Boot method to auto-generate codigo_unico.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($menu) {
            if (empty($menu->codigo_unico)) {
                $menu->codigo_unico = static::generarCodigoUnico();
            }
        });
    }

    /**
     * Generate a unique code for the menu.
     *
     * @return string
     */
    public static function generarCodigoUnico()
    {
        do {
            $codigo = Str::random(10);
        } while (static::where('codigo_unico', $codigo)->exists());

        return $codigo;
    }

    /**
     * Get posiciones attribute with default values if null.
     *
     * @return array
     */
    public function getPosicionesAttribute($value)
    {
        // NUEVO SISTEMA TOP-BASED: pos.y representa el TOP del elemento
        if (empty($value)) {
            return [
                'precio' => ['x' => 280, 'y' => 135],      // top = centerY - radius
                'entradas' => ['x' => 50, 'y' => 220],     // top = baseline - 30
                'segundos' => ['x' => 50, 'y' => 440],     // top = baseline - 30
                'extras' => ['x' => 450, 'y' => 250],      // top = baseline - 30
                'bebidas' => ['x' => 730, 'y' => 50],      // top = baseline - 30
            ];
        }
        
        // If it's a JSON string, decode it
        if (is_string($value)) {
            return json_decode($value, true);
        }
        
        return $value;
    }

    /**
     * Get the public URL for the menu.
     *
     * @return string
     */
    public function obtenerUrlPublica()
    {
        return env('FRONTEND_URL', 'http://localhost:5173') . '/menu/' . $this->codigo_unico;
    }

    /**
     * Get the user that owns the menu.
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    /**
     * Get the menu items for the menu.
     */
    public function items()
    {
        return $this->hasMany(ItemMenu::class, 'menu_id')->orderBy('orden');
    }
}
