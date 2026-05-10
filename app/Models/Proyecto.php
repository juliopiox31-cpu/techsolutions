<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proyecto extends Model
{
    protected $guarded = [];

    public function cliente()
    {
        return $this->belongsTo(User::class, 'cliente_id');
    }

    public function tareas()
    {
        return $this->hasMany(Tarea::class);
    }
}
