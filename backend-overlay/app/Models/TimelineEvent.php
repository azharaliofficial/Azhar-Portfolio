<?php

namespace App\Models;

use App\Models\Concerns\Ordered;
use Illuminate\Database\Eloquent\Model;

class TimelineEvent extends Model
{
    use Ordered;

    protected $guarded = [];

    protected $casts = ['is_current' => 'boolean'];
}
