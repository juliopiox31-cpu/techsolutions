<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Proyecto;
use App\Models\Tarea;
use App\Models\User;

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

        for ($mes = 1; $mes <= 12; $mes++) {
            $actividadMensual[] = [
                'mes' => $mes,
                'proyectos' => Proyecto::whereMonth('created_at', $mes)->count(),
                'tareas' => Tarea::whereMonth('created_at', $mes)->count(),
                'clientes' => Cliente::whereMonth('created_at', $mes)->count(),
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