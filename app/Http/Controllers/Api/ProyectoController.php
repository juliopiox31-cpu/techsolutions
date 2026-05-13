<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use Illuminate\Http\Request;

class ProyectoController extends Controller
{
    public function index()
    {
        $proyectos = Proyecto::with(['cliente', 'createdBy', 'updatedBy'])
            ->latest()
            ->get();

        return response()->json($proyectos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);

        $uid = auth()->id();

        $proyecto = Proyecto::create([
            'cliente_id' => $request->cliente_id,
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'En progreso',
            'created_by' => $uid,
            'updated_by' => $uid,
        ]);

        return response()->json([
            'message' => 'Proyecto creado correctamente',
            'proyecto' => $proyecto,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $proyecto = Proyecto::findOrFail($id);

        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);

        $proyecto->update([
            'cliente_id' => $request->cliente_id,
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'En progreso',
            'updated_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Proyecto actualizado correctamente',
            'proyecto' => $proyecto,
        ]);
    }

    public function destroy($id)
    {
        $proyecto = Proyecto::findOrFail($id);
        $proyecto->delete();

        return response()->json([
            'message' => 'Proyecto eliminado correctamente',
        ]);
    }
}
