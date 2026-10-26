<?php

namespace App\Models;

use App\Models\Concerns\Ordered;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use Ordered;

    protected $guarded = [];

    protected $casts = ['level' => 'integer'];
}
