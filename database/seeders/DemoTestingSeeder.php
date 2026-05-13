<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Proyecto;
use App\Models\Tarea;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Datos de demostración para entorno local.
 *
 * Credenciales (contraseña en todos los casos: password):
 * - admin@techsolutions.test — Administrador
 * - trabajador@techsolutions.test — Trabajador
 * - cliente@techsolutions.test — Cliente (vista Mi Dashboard)
 */
class DemoTestingSeeder extends Seeder
{
    public const DEMO_PASSWORD = 'password';

    public function run(): void
    {
        $password = Hash::make(self::DEMO_PASSWORD);

        $admin = User::updateOrCreate(
            ['email' => 'admin@techsolutions.test'],
            [
                'name' => 'Administrador Demo',
                'password' => $password,
                'role' => 'Administrador',
                'status' => 'Activo',
                'email_verified_at' => now(),
            ]
        );

        $adminId = $admin->id;

        $trabajador = User::updateOrCreate(
            ['email' => 'trabajador@techsolutions.test'],
            [
                'name' => 'María Trabajadora',
                'password' => $password,
                'role' => 'Trabajador',
                'status' => 'Activo',
                'phone' => '+502 5555-0101',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'cliente@techsolutions.test'],
            [
                'name' => 'Carlos Cliente',
                'password' => $password,
                'role' => 'Cliente',
                'status' => 'Activo',
                'email_verified_at' => now(),
            ]
        );

        $clienteAcme = Cliente::updateOrCreate(
            ['email' => 'contacto@acme.test'],
            [
                'name' => 'ACME Corp',
                'phone' => '+502 5555-0201',
                'company' => 'ACME',
                'status' => 'Activo',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]
        );

        $clienteGlobal = Cliente::updateOrCreate(
            ['email' => 'ventas@global.test'],
            [
                'name' => 'Global Solutions',
                'phone' => '+502 5555-0301',
                'company' => 'Global Solutions S.A.',
                'status' => 'Activo',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]
        );

        $proyecto1 = Proyecto::firstOrCreate(
            ['name' => 'Sistema de Control de Obras'],
            [
                'cliente_id' => $clienteAcme->id,
                'description' => 'Control de personal y avance en obra.',
                'status' => 'En progreso',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]
        );

        if ($proyecto1->cliente_id !== $clienteAcme->id) {
            $proyecto1->update([
                'cliente_id' => $clienteAcme->id,
                'description' => 'Control de personal y avance en obra.',
                'status' => 'En progreso',
                'updated_by' => $adminId,
            ]);
        }

        $proyecto2 = Proyecto::firstOrCreate(
            ['name' => 'Portal de facturación'],
            [
                'cliente_id' => $clienteGlobal->id,
                'description' => 'Módulo de facturas y cobros en línea.',
                'status' => 'Pausado',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]
        );

        if ($proyecto2->cliente_id !== $clienteGlobal->id) {
            $proyecto2->update([
                'cliente_id' => $clienteGlobal->id,
                'description' => 'Módulo de facturas y cobros en línea.',
                'status' => 'Pausado',
                'updated_by' => $adminId,
            ]);
        }

        Tarea::firstOrCreate(
            [
                'proyecto_id' => $proyecto1->id,
                'title' => 'Reunión de arranque con cliente',
            ],
            [
                'user_id' => $trabajador->id,
                'description' => 'Kickoff y levantamiento de requisitos.',
                'status' => 'En progreso',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]
        );

        Tarea::firstOrCreate(
            [
                'proyecto_id' => $proyecto1->id,
                'title' => 'Diseño de wireframes',
            ],
            [
                'user_id' => $trabajador->id,
                'description' => 'Pantallas principales del sistema.',
                'status' => 'Pendiente',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]
        );

        Tarea::firstOrCreate(
            [
                'proyecto_id' => $proyecto2->id,
                'title' => 'Integración API SAT',
            ],
            [
                'user_id' => $trabajador->id,
                'description' => 'Pruebas de timbrado.',
                'status' => 'Pendiente',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]
        );
    }
}
