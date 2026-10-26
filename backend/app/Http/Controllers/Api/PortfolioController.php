<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Academic;
use App\Models\Certificate;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\TimelineEvent;
use Illuminate\Http\JsonResponse;

/**
 * Public, read-only endpoints. Field names match the React frontend exactly
 * (see frontend/src/data/fallback.js), and responses are bare JSON with no
 * "data" wrapper.
 */
class PortfolioController extends Controller
{
    public function profile(): JsonResponse
    {
        $profile = Profile::query()->first();
        abort_if($profile === null, 404, 'Profile has not been set up yet.');

        return response()->json([
            'name' => $profile->name,
            'role' => $profile->role,
            'location' => $profile->location,
            'headline' => $profile->headline,
            'bio' => $profile->bio,
            'github_url' => $profile->github_url,
            'linkedin_url' => $profile->linkedin_url,
            'resume_url' => $profile->resume_url,
            'photo_url' => $this->mediaUrl($profile->photo_path),
            'gallery' => $this->mediaUrls($profile->gallery),
        ]);
    }

    public function academics(): JsonResponse
    {
        return $this->list(Academic::ordered()->get(), ['position', 'kind', 'title', 'subtitle']);
    }

    public function timeline(): JsonResponse
    {
        return $this->list(
            TimelineEvent::ordered()->get(),
            ['date_label', 'title', 'description', 'is_current'],
            fn ($e) => ['image_url' => $this->mediaUrl($e->image_path)]
        );
    }

    public function services(): JsonResponse
    {
        return $this->list(Service::ordered()->get(), ['code', 'title', 'description', 'stack']);
    }

    public function skills(): JsonResponse
    {
        return response()->json(
            Skill::ordered()->get()->map(fn (Skill $skill) => [
                'name' => $skill->name,
                'level' => $skill->level,
                'group' => $skill->group_name,
            ])->values()
        );
    }

    public function projects(): JsonResponse
    {
        return $this->list(
            Project::published()->ordered()->get(),
            ['slug', 'code', 'tag', 'title', 'problem', 'built_with', 'result', 'case_study', 'github_url', 'demo_url'],
            fn ($p) => [
                'cover_url' => $this->mediaUrl($p->cover_path),
                'gallery' => $this->mediaUrls($p->gallery),
            ]
        );
    }

    public function experiences(): JsonResponse
    {
        return $this->list(
            Experience::ordered()->get(),
            ['type', 'role', 'org', 'summary'],
            fn ($e) => ['image_url' => $this->mediaUrl($e->image_path)]
        );
    }

    public function certificates(): JsonResponse
    {
        return $this->list(
            Certificate::ordered()->get(),
            ['title', 'issuer', 'date_label', 'link_label', 'url'],
            fn ($c) => ['image_url' => $this->mediaUrl($c->image_path)]
        );
    }

    /**
     * @param  \Illuminate\Support\Collection<int, \Illuminate\Database\Eloquent\Model>  $models
     * @param  array<int, string>  $fields
     * @param  (callable(\Illuminate\Database\Eloquent\Model): array<string, mixed>)|null  $extra
     */
    private function list($models, array $fields, ?callable $extra = null): JsonResponse
    {
        return response()->json(
            $models->map(fn ($model) => $model->only($fields) + ($extra ? $extra($model) : []))->values()
        );
    }

    /**
     * Uploaded files live on the "public" disk. A relative URL is returned so
     * the frontend can prefix whichever API address it talks to.
     */
    private function mediaUrl(?string $path): ?string
    {
        return $path ? '/storage/'.ltrim($path, '/') : null;
    }

    /** @return array<int, string> */
    private function mediaUrls(?array $paths): array
    {
        return collect($paths ?? [])->filter()->map(fn ($p) => $this->mediaUrl($p))->values()->all();
    }
}
