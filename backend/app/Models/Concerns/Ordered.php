<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait Ordered
{
    /** Admin-controlled order first, then oldest first. */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
