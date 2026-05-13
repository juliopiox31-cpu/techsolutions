<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            ['name' => 'manage_roles', 'label' => 'Gestionar roles y permisos', 'group' => 'ROLES', 'description' => 'Crear roles y cambiar los permisos asignados a cada uno.'],
            ['name' => 'manage_users', 'label' => 'Gestionar usuarios', 'group' => 'USUARIOS', 'description' => 'Invitar usuarios, asignar roles y revisar quién tiene acceso.'],
            ['name' => 'module_clientes', 'label' => 'Acceso al módulo Clientes', 'group' => 'CLIENTES', 'description' => 'Ver Clientes en el menú lateral y navegar dentro del módulo.'],
            ['name' => 'view_clientes', 'label' => 'Ver clientes', 'group' => 'CLIENTES', 'description' => 'Consultar la lista de clientes y el detalle de cada registro.'],
            ['name' => 'create_clientes', 'label' => 'Crear clientes', 'group' => 'CLIENTES', 'description' => 'Registrar nuevas organizaciones o contactos en el sistema.'],
            ['name' => 'edit_clientes', 'label' => 'Editar clientes', 'group' => 'CLIENTES', 'description' => 'Modificar datos de clientes ya existentes.'],
            ['name' => 'delete_clientes', 'label' => 'Eliminar clientes', 'group' => 'CLIENTES', 'description' => 'Dar de baja clientes cuando no tengan proyectos asociados.'],
            ['name' => 'module_proyectos', 'label' => 'Acceso al módulo Proyectos', 'group' => 'PROYECTOS', 'description' => 'Ver Proyectos en el menú lateral e ingresar al módulo.'],
            ['name' => 'view_proyectos', 'label' => 'Ver proyectos', 'group' => 'PROYECTOS', 'description' => 'Consultar proyectos y su información relacionada.'],
            ['name' => 'create_proyectos', 'label' => 'Crear proyectos', 'group' => 'PROYECTOS', 'description' => 'Registrar proyectos nuevos y asociarlos a un cliente.'],
            ['name' => 'edit_proyectos', 'label' => 'Editar proyectos', 'group' => 'PROYECTOS', 'description' => 'Actualizar alcance, fechas o estado del proyecto.'],
            ['name' => 'delete_proyectos', 'label' => 'Eliminar proyectos', 'group' => 'PROYECTOS', 'description' => 'Borrar proyectos que no tengan tareas activas.'],

            ['name' => 'module_tareas', 'label' => 'Acceso al módulo Tareas', 'group' => 'TAREAS', 'description' => 'Ver Tareas en el menú lateral y navegar dentro del módulo.'],
            ['name' => 'module_reportes', 'label' => 'Acceso al módulo Reportes', 'group' => 'REPORTES', 'description' => 'Ver Reportes y estadísticas del sistema.'],
            ['name' => 'module_settings', 'label' => 'Acceso a Ajustes', 'group' => 'CONFIGURACION', 'description' => 'Modificar ajustes generales del sistema.'],
        ];

        foreach ($permissions as $p) {
            DB::table('permissions')->updateOrInsert(['name' => $p['name']], $p);
        }

        $roles = [
            'Administrador' => ['manage_roles', 'manage_users', 'module_clientes', 'view_clientes', 'create_clientes', 'edit_clientes', 'delete_clientes', 'module_proyectos', 'view_proyectos', 'create_proyectos', 'edit_proyectos', 'delete_proyectos', 'module_tareas', 'module_reportes', 'module_settings'],
            'Editor' => ['module_clientes', 'view_clientes', 'create_clientes', 'edit_clientes', 'module_proyectos', 'view_proyectos', 'create_proyectos', 'edit_proyectos', 'module_tareas'],
            'Piox' => ['module_clientes', 'view_clientes', 'module_proyectos', 'view_proyectos'],
            'Usuario' => ['module_clientes', 'view_clientes', 'module_proyectos', 'view_proyectos'],
            'Trabajador' => ['module_proyectos', 'view_proyectos', 'module_tareas'],
            'Cliente' => [],
        ];

        foreach ($roles as $roleName => $perms) {
            DB::table('roles')->updateOrInsert(['name' => $roleName], ['name' => $roleName]);
            $role = DB::table('roles')->where('name', $roleName)->first();

            DB::table('permission_role')->where('role_id', $role->id)->delete();
            foreach ($perms as $pName) {
                $perm = DB::table('permissions')->where('name', $pName)->first();
                if ($perm) {
                    DB::table('permission_role')->insert(['role_id' => $role->id, 'permission_id' => $perm->id]);
                }
            }
        }
    }
}
