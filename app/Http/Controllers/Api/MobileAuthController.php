<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MobileAuthController extends Controller
{
    public function login(Request $request)
    {
        // Validación
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Buscar usuario
        $user = User::where('email', trim($request->email))->first();

        // Verificar usuario y contraseña
        if (!$user || !Hash::check($request->password, $user->password)) {

            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Validar estado si existe columna status
        if (isset($user->status)) {

            $status = strtolower(trim($user->status));

            if (!in_array($status, ['activo', 'active'])) {

                return response()->json([
                    'success' => false,
                    'message' => 'Usuario inactivo'
                ], 403);
            }
        }

        // Eliminar tokens viejos opcional
        $user->tokens()->delete();

        // Crear token
        $token = $user->createToken('mobile-app')->plainTextToken;

        // Respuesta correcta
        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión correcto',
            'token' => $token,
            'user' => $user,
        ]);
    }

    // Obtener usuario autenticado
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente',
        ]);
    }
}