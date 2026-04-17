<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AutenticacionController;
use App\Http\Controllers\MenuController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Rutas públicas de autenticación
Route::post('/autenticacion/registrar', [AutenticacionController::class, 'registrar']);
Route::post('/autenticacion/iniciar-sesion', [AutenticacionController::class, 'iniciarSesion']);

// Ruta pública para ver menú
Route::get('/publico/menu/{codigo}', [MenuController::class, 'verPublico']);

// Rutas protegidas con autenticación Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/autenticacion/cerrar-sesion', [AutenticacionController::class, 'cerrarSesion']);
    Route::get('/autenticacion/usuario', [AutenticacionController::class, 'obtenerUsuario']);
    
    // Menús
    Route::get('/menus', [MenuController::class, 'index']);
    Route::post('/menus', [MenuController::class, 'store']);
    Route::get('/menus/{id}', [MenuController::class, 'show']);
    Route::put('/menus/{id}', [MenuController::class, 'update']);
    Route::delete('/menus/{id}', [MenuController::class, 'destroy']);
    
    // Código QR y utilidades
    Route::get('/menus/{id}/generar-qr', [MenuController::class, 'generarQR']);
    Route::put('/menus/{id}/activar-desactivar', [MenuController::class, 'activarDesactivar']);
    Route::post('/menus/subir-imagen', [MenuController::class, 'subirImagen']);
});
