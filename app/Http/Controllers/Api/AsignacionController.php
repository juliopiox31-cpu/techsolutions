<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class AsignacionController extends Controller
{
    public function index()
    {
        $trabajadores = User::where('role', 'Trabajador')
            ->with([
                'tareas.proyecto'
            ])
            ->get()
            ->map(function ($trabajador) {
                $proyectos = $trabajador->tareas
                    ->pluck('proyecto')
                    ->filter()
                    ->unique('id')
                    ->values();

                return [
                    'id' => $trabajador->id,
                    'name' => $trabajador->name,
                    'email' => $trabajador->email,
                    'phone' => $trabajador->phone,
                    'status' => $trabajador->status,
                    'total_proyectos' => $proyectos->count(),
                    'total_tareas' => $trabajador->tareas->count(),
                    'proyectos' => $proyectos->map(function ($proyecto) {
                        return [
                            'id' => $proyecto->id,
                            'name' => $proyecto->name,
                            'description' => $proyecto->description,
                            'status' => $proyecto->status,
                        ];
                    })->values(),
                ];
            });

        return response()->json($trabajadores);
    }
}