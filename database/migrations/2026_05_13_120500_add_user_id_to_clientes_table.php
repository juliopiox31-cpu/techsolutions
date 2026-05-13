<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->after('id')
                ->constrained('users')
                ->nullOnDelete();

            $table->unique('user_id');
        });

        $this->backfillClientesForExistingUsers();
    }

    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
            $table->dropConstrainedForeignId('user_id');
        });
    }

    /**
     * Asegura que cada usuario con rol "Cliente" tenga su registro en
     * la tabla `clientes`. Si existe un cliente con el mismo email sin
     * vincular, lo enlaza al usuario en lugar de duplicarlo.
     */
    private function backfillClientesForExistingUsers(): void
    {
        $clienteUsers = DB::table('users')
            ->where('role', 'Cliente')
            ->get();

        $now = now();

        foreach ($clienteUsers as $user) {
            $existingByEmail = DB::table('clientes')
                ->whereNull('user_id')
                ->where('email', $user->email)
                ->first();

            if ($existingByEmail) {
                DB::table('clientes')
                    ->where('id', $existingByEmail->id)
                    ->update([
                        'user_id' => $user->id,
                        'name' => $user->name,
                        'phone' => $user->phone ?? $existingByEmail->phone,
                        'company' => $user->company ?? $existingByEmail->company,
                        'password' => $existingByEmail->password ?? $user->password,
                        'status' => $existingByEmail->status ?: 'Activo',
                        'updated_at' => $now,
                    ]);

                continue;
            }

            $alreadyLinked = DB::table('clientes')
                ->where('user_id', $user->id)
                ->exists();

            if ($alreadyLinked) {
                continue;
            }

            DB::table('clientes')->insert([
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'company' => $user->company,
                'password' => $user->password,
                'status' => 'Activo',
                'created_at' => $user->created_at ?? $now,
                'updated_at' => $now,
            ]);
        }
    }
};
