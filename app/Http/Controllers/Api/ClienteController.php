<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::with(['createdBy', 'updatedBy'])
            ->latest()
            ->get();

        return response()->json($clientes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
        ]);

        $uid = auth()->id();

        $cliente = Cliente::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'company' => $request->company,
            'status' => $request->status ?? 'Activo',
            'created_by' => $uid,
            'updated_by' => $uid,
        ]);

        return response()->json([
            'message' => 'Cliente creado correctamente',
            'cliente' => $cliente,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
        ]);

        $cliente->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'company' => $request->company,
            'status' => $request->status ?? 'Activo',
            'updated_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Cliente actualizado correctamente',
            'cliente' => $cliente,
        ]);
    }

    public function destroy($id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete();

        return response()->json([
            'message' => 'Cliente eliminado correctamente',
        ]);
    }
}
