<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mensaje;

class BandejaController extends Controller
{
    public function index()
    {
        $mensajes = Mensaje::with('user')
            ->latest()
            ->get()
            ->map(function ($mensaje) {
                return [
                    'id' => $mensaje->id,
                    'user_id' => $mensaje->user_id,
                    'type' => $mensaje->type,
                    'subject' => $mensaje->subject,
                    'content' => $mensaje->content,
                    'status' => $mensaje->status,
                    'created_at' => $mensaje->created_at,
                    'updated_at' => $mensaje->updated_at,
                    'user' => $mensaje->user ? [
                        'id' => $mensaje->user->id,
                        'name' => $mensaje->user->name,
                        'email' => $mensaje->user->email,
                        'company' => $mensaje->user->company,
                        'phone' => $mensaje->user->phone,
                        'role' => $mensaje->user->role,
                    ] : null,
                ];
            });

        return response()->json($mensajes);
    }

    public function marcarLeido($id)
    {
        $mensaje = Mensaje::findOrFail($id);

        $mensaje->update([
            'status' => 'leido',
        ]);

        return response()->json([
            'message' => 'Mensaje marcado como leído',
            'mensaje' => $mensaje,
        ]);
    }

    public function destroy($id)
    {
        $mensaje = Mensaje::findOrFail($id);
        $mensaje->delete();

        return response()->json([
            'message' => 'Mensaje eliminado correctamente',
        ]);
    }
}