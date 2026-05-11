<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Proyecto;
use App\Models\Tarea;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'clientes' => Cliente::count(),
            'proyectos' => Proyecto::count(),
            'tareas_pendientes' => Tarea::where('status', 'Pendiente')->count(),
            'tareas_en_progreso' => Tarea::where('status', 'En progreso')->count(),
            'tareas_completadas' => Tarea::where('status', 'Completado')->count(),
            'actividades' => [
                [
                    'title' => 'Clientes registrados',
                    'subtitle' => Cliente::count() . ' clientes en el sistema',
                    'icon' => 'clientes',
                ],
                [
                    'title' => 'Proyectos activos',
                    'subtitle' => Proyecto::count() . ' proyectos registrados',
                    'icon' => 'proyectos',
                ],
                [
                    'title' => 'Tareas pendientes',
                    'subtitle' => Tarea::where('status', 'Pendiente')->count() . ' tareas por completar',
                    'icon' => 'tareas',
                ],
            ],
        ]);
    }
}