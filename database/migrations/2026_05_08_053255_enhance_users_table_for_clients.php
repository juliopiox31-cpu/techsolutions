<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Cliente;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('company')->nullable()->after('role');
            $table->string('phone')->nullable()->after('company');
        });

        // Migrate existing clients to users table
        $clientes = DB::table('clientes')->get();
        foreach ($clientes as $cliente) {
            // Check if user already exists
            $userId = DB::table('users')->where('email', $cliente->email)->value('id');
            
            if (!$userId) {
                $userId = DB::table('users')->insertGetId([
                    'name' => $cliente->name,
                    'email' => $cliente->email,
                    'password' => $cliente->password ?? bcrypt('password'),
                    'role' => 'Cliente',
                    'status' => $cliente->status ?? 'Activo',
                    'company' => $cliente->company,
                    'phone' => $cliente->phone,
                    'created_at' => $cliente->created_at,
                    'updated_at' => $cliente->updated_at,
                ]);
            } else {
                DB::table('users')->where('id', $userId)->update([
                    'role' => 'Cliente',
                    'company' => $cliente->company,
                    'phone' => $cliente->phone,
                ]);
            }

            // Update projects to point to the new user ID
            DB::table('proyectos')->where('cliente_id', $cliente->id)->update(['cliente_id' => $userId]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['company', 'phone']);
        });
    }
};
