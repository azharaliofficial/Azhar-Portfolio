<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Adds image uploads and project case studies. Purely additive, so it is safe
 * to run on a database that already has data (php artisan migrate).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->json('gallery')->nullable();
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique();
            $table->string('cover_path')->nullable();
            $table->json('gallery')->nullable();
            $table->text('case_study')->nullable();
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->string('image_path')->nullable();
        });

        Schema::table('timeline_events', function (Blueprint $table) {
            $table->string('image_path')->nullable();
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->string('image_path')->nullable();
        });

        // Give every existing project a URL slug.
        $used = [];
        foreach (DB::table('projects')->orderBy('id')->get(['id', 'title']) as $row) {
            $base = Str::slug($row->title) ?: 'project';
            $slug = $base;
            for ($i = 2; in_array($slug, $used, true); $i++) {
                $slug = $base.'-'.$i;
            }
            $used[] = $slug;
            DB::table('projects')->where('id', $row->id)->update(['slug' => $slug]);
        }
    }

    public function down(): void
    {
        Schema::table('experiences', fn (Blueprint $t) => $t->dropColumn('image_path'));
        Schema::table('timeline_events', fn (Blueprint $t) => $t->dropColumn('image_path'));
        Schema::table('certificates', fn (Blueprint $t) => $t->dropColumn('image_path'));
        Schema::table('projects', function (Blueprint $t) {
            $t->dropUnique(['slug']);
            $t->dropColumn(['slug', 'cover_path', 'gallery', 'case_study']);
        });
        Schema::table('profiles', fn (Blueprint $t) => $t->dropColumn('gallery'));
    }
};
