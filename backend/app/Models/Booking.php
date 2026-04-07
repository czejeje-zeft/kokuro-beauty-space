<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'name', 'phone', 'service', 'date',
        'time', 'addons', 'address', 'notes', 'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}
