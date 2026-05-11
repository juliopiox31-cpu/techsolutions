<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MobileAuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\ProyectoController;
use App\Http\Controllers\Api\TareaController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\AsignacionController;
use App\Http\Controllers\Api\BandejaController;
use App\Http\Controllers\Api\ReporteController;
use App\Http\Controllers\Api\AjustesController;

// =========================
// RUTAS LIBRES
// =========================

Route::post('/mobile/login', [MobileAuthController::class, 'login']);
Route::post('/mobile/register', [MobileAuthController::class, 'register']);

// =========================
// RUTAS PROTEGIDAS CON TOKEN
// =========================

Route::middleware('auth:sanctum')->group(function () {

    // Usuario autenticado y logout
    Route::get('/mobile/user', [MobileAuthController::class, 'user']);
    Route::post('/mobile/logout', [MobileAuthController::class, 'logout']);

    // Dashboard: todos los roles autenticados
    Route::get('/mobile/dashboard', [DashboardController::class, 'index']);

    // Ajustes del usuario autenticado
    Route::get('/mobile/ajustes/perfil', [AjustesController::class, 'perfil']);
    Route::put('/mobile/ajustes/perfil', [AjustesController::class, 'actualizarPerfil']);
    Route::put('/mobile/ajustes/password', [AjustesController::class, 'cambiarPassword']);

    // Clientes: solo Administrador
    Route::middleware('role:Administrador')->group(function () {
        Route::get('/mobile/clientes', [ClienteController::class, 'index']);
        Route::post('/mobile/clientes', [ClienteController::class, 'store']);
        Route::put('/mobile/clientes/{id}', [ClienteController::class, 'update']);
        Route::delete('/mobile/clientes/{id}', [ClienteController::class, 'destroy']);
    });

    // Usuarios: solo Administrador
    Route::middleware('role:Administrador')->group(function () {
        Route::get('/mobile/usuarios', [UsuarioController::class, 'index']);
        Route::post('/mobile/usuarios', [UsuarioController::class, 'store']);
        Route::put('/mobile/usuarios/{id}', [UsuarioController::class, 'update']);
        Route::delete('/mobile/usuarios/{id}', [UsuarioController::class, 'destroy']);
    });

    // Asignaciones de trabajadores: solo Administrador
    Route::get('/mobile/asignaciones', [AsignacionController::class, 'index'])
        ->middleware('role:Administrador');

    // Bandeja de entrada: solo Administrador
    Route::middleware('role:Administrador')->group(function () {
        Route::get('/mobile/bandeja', [BandejaController::class, 'index']);
        Route::put('/mobile/bandeja/{id}/leido', [BandejaController::class, 'marcarLeido']);
        Route::delete('/mobile/bandeja/{id}', [BandejaController::class, 'destroy']);
    });

    // Reportes: solo Administrador
    Route::get('/mobile/reportes', [ReporteController::class, 'index'])
        ->middleware('role:Administrador');

    // Proyectos: todos pueden ver, solo Administrador puede modificar
    Route::get('/mobile/proyectos', [ProyectoController::class, 'index']);

    Route::post('/mobile/proyectos', [ProyectoController::class, 'store'])
        ->middleware('role:Administrador');

    Route::put('/mobile/proyectos/{id}', [ProyectoController::class, 'update'])
        ->middleware('role:Administrador');

    Route::delete('/mobile/proyectos/{id}', [ProyectoController::class, 'destroy'])
        ->middleware('role:Administrador');

    // Tareas: todos pueden ver, Administrador/Trabajador pueden crear y editar, solo Administrador elimina
    Route::get('/mobile/tareas', [TareaController::class, 'index']);

    Route::post('/mobile/tareas', [TareaController::class, 'store'])
        ->middleware('role:Administrador,Trabajador');

    Route::put('/mobile/tareas/{id}', [TareaController::class, 'update'])
        ->middleware('role:Administrador,Trabajador');

    Route::delete('/mobile/tareas/{id}', [TareaController::class, 'destroy'])
        ->middleware('role:Administrador');
});