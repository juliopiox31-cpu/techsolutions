<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Proyecto;
use App\Models\Tarea;
use App\Models\User;
use App\Support\GuatemalaTime;

class ReporteController extends Controller
{
    public function index()
    {
        $proyectosTotales = Proyecto::count();
        $tareasTotales = Tarea::count();
        $clientesTotales = Cliente::count();
        $usuariosTotales = User::count();

        $tareasPendientes = Tarea::where('status', 'Pendiente')->count();
        $tareasEnProgreso = Tarea::where('status', 'En progreso')->count();
        $tareasCompletadas = Tarea::where('status', 'Completada')->count();

        $proyectosPorEstado = [
            'en_progreso' => Proyecto::where('status', 'En progreso')->count(),
            'completados' => Proyecto::where('status', 'Completado')->count(),
            'pendientes' => Proyecto::where('status', 'Pendiente')->count(),
        ];

        $actividadMensual = [];

        $proyectosAll = Proyecto::all();
        $tareasAll = Tarea::all();
        $clientesAll = Cliente::all();

        for ($mes = 1; $mes <= 12; $mes++) {
            $actividadMensual[] = [
                'mes' => $mes,
                'proyectos' => $proyectosAll->filter(function ($p) use ($mes) {
                    return $p->created_at && GuatemalaTime::monthInZone($p->created_at) === $mes;
                })->count(),
                'tareas' => $tareasAll->filter(function ($t) use ($mes) {
                    return $t->created_at && GuatemalaTime::monthInZone($t->created_at) === $mes;
                })->count(),
                'clientes' => $clientesAll->filter(function ($c) use ($mes) {
                    return $c->created_at && GuatemalaTime::monthInZone($c->created_at) === $mes;
                })->count(),
            ];
        }

        return response()->json([
            'proyectos_totales' => $proyectosTotales,
            'tareas_totales' => $tareasTotales,
            'clientes_totales' => $clientesTotales,
            'usuarios_totales' => $usuariosTotales,

            'tareas' => [
                'pendientes' => $tareasPendientes,
                'en_progreso' => $tareasEnProgreso,
                'completadas' => $tareasCompletadas,
            ],

            'proyectos' => $proyectosPorEstado,

            'actividad_mensual' => $actividadMensual,
        ]);
    }
}
