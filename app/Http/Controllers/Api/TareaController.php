<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tarea;
use Illuminate\Http\Request;

class TareaController extends Controller
{
    public function index()
    {
        $tareas = Tarea::with(['proyecto', 'user'])
            ->latest()
            ->get();

        return response()->json($tareas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'proyecto_id' => 'required|exists:proyectos,id',
            'user_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);

        $tarea = Tarea::create([
            'proyecto_id' => $request->proyecto_id,
            'user_id' => $request->user_id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'Pendiente',
        ]);

        return response()->json([
            'message' => 'Tarea creada correctamente',
            'tarea' => $tarea,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $tarea = Tarea::findOrFail($id);

        $request->validate([
            'proyecto_id' => 'required|exists:proyectos,id',
            'user_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);

        $tarea->update([
            'proyecto_id' => $request->proyecto_id,
            'user_id' => $request->user_id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'Pendiente',
        ]);

        return response()->json([
            'message' => 'Tarea actualizada correctamente',
            'tarea' => $tarea,
        ]);
    }

    public function destroy($id)
    {
        $tarea = Tarea::findOrFail($id);
        $tarea->delete();

        return response()->json([
            'message' => 'Tarea eliminada correctamente',
        ]);
    }
}