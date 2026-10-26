<?php

namespace App\Models;

use App\Models\Concerns\Ordered;
use Illuminate\Database\Eloquent\Model;

class Academic extends Model
{
    use Ordered;

    protected $guarded = [];
}
