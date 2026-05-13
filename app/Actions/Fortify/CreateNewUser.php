<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => $this->nameRules(),
            'email' => $this->emailRules(),
            'password' => $this->passwordRules(),
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
        ])->validate();

        return DB::transaction(function () use ($input): User {
            $hashedPassword = Hash::make($input['password']);

            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $hashedPassword,
                'company' => $input['company'] ?? null,
                'phone' => $input['phone'] ?? null,
                'role' => 'Cliente',
            ]);

            // Reutiliza un cliente sin usuario que tenga el mismo email
            // (por si el admin lo creó previamente desde el panel) y, si
            // no existe, crea uno nuevo y lo vincula al usuario.
            $cliente = Cliente::whereNull('user_id')
                ->where('email', $user->email)
                ->first();

            if ($cliente) {
                $cliente->update([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'phone' => $user->phone ?? $cliente->phone,
                    'company' => $user->company ?? $cliente->company,
                    'password' => $hashedPassword,
                    'status' => $cliente->status ?: 'Activo',
                ]);
            } else {
                Cliente::create([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'company' => $user->company,
                    'password' => $hashedPassword,
                    'status' => 'Activo',
                ]);
            }

            return $user;
        });
    }
}
