<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    protected $guarded = [];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
