<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Service extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'service_id';



    protected $fillable = [
        'nom_service',
        'descreption_s',
        'active',
    ];

    public function consomation(): HasMany
    {
        return $this->hasMany(Consumption::class, 'service_id', 'service_id');
    }

    public function assets(): MorphMany
    {
        return $this->morphMany(Assets::class, 'imageable');
    }
}