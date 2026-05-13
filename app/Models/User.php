<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
     * Registro de cliente vinculado a este usuario (rol Cliente).
     */
    public function cliente(): HasOne
    {
        return $this->hasOne(Cliente::class, 'user_id');
    }

    /**
     * Proyectos donde este usuario es cliente.
     * Se obtienen a través del registro vinculado en la tabla `clientes`.
     */
    public function proyectos(): HasManyThrough
    {
        return $this->hasManyThrough(
            Proyecto::class,
            Cliente::class,
            'user_id',
            'cliente_id',
            'id',
            'id',
        );
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