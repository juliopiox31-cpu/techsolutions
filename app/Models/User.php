<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'company',
        'phone',
    ];

    /**
     * Hidden fields for API responses.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Attribute casts.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Proyectos donde este usuario es cliente.
     * Se usa cuando el usuario tiene rol Cliente.
     */
    public function proyectos()
    {
        return $this->hasMany(Proyecto::class, 'cliente_id');
    }

    /**
     * Tareas asignadas a este usuario.
     * Se usa cuando el usuario tiene rol Trabajador.
     */
    public function tareas()
    {
        return $this->hasMany(Tarea::class, 'user_id');
    }

    /**
     * Alias de tareas asignadas.
     * Lo dejamos por compatibilidad con código anterior.
     */
    public function tareasAsignadas()
    {
        return $this->hasMany(Tarea::class, 'user_id');
    }
}