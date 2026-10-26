<?php

namespace App\Models;

use App\Models\Concerns\Ordered;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    use Ordered;

    protected $guarded = [];

    protected $casts = ['is_published' => 'boolean', 'gallery' => 'array'];

    protected static function booted(): void
    {
        // Every project gets a unique URL slug (used by the case-study page).
        static::saving(function (Project $project) {
            if (filled($project->slug)) {
                $project->slug = Str::slug($project->slug);
                return;
            }

            $base = Str::slug((string) $project->title) ?: 'project';
            $slug = $base;
            for ($i = 2; static::query()->where('slug', $slug)->where('id', '!=', $project->id ?? 0)->exists(); $i++) {
                $slug = $base.'-'.$i;
            }
            $project->slug = $slug;
        });
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
