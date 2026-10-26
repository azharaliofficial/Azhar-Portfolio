<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_health_check(): void
    {
        $this->getJson('/api/health')->assertOk()->assertJson(['status' => 'ok']);
    }

    public function test_profile_matches_frontend_contract(): void
    {
        $this->getJson('/api/profile')
            ->assertOk()
            ->assertJsonStructure(['name', 'role', 'location', 'headline', 'bio', 'github_url', 'linkedin_url', 'resume_url'])
            ->assertJson(['name' => 'Azhar Ali']);
    }

    public function test_list_endpoints_return_bare_arrays_in_order(): void
    {
        $this->getJson('/api/academics')->assertOk()->assertJsonCount(4)
            ->assertJsonStructure(['*' => ['position', 'kind', 'title', 'subtitle']])
            ->assertJsonPath('0.position', 'tl');

        $this->getJson('/api/timeline')->assertOk()->assertJsonCount(8)
            ->assertJsonStructure(['*' => ['date_label', 'title', 'description', 'is_current']])
            ->assertJsonPath('7.is_current', true);

        $this->getJson('/api/services')->assertOk()->assertJsonCount(4)
            ->assertJsonStructure(['*' => ['code', 'title', 'description', 'stack']]);

        $this->getJson('/api/experiences')->assertOk()->assertJsonCount(3)
            ->assertJsonStructure(['*' => ['type', 'role', 'org', 'summary']]);

        $this->getJson('/api/certificates')->assertOk()->assertJsonCount(6)
            ->assertJsonStructure(['*' => ['title', 'issuer', 'date_label', 'link_label', 'url']]);
    }

    public function test_skills_expose_group_not_group_name(): void
    {
        $this->getJson('/api/skills')->assertOk()->assertJsonCount(10)
            ->assertJsonStructure(['*' => ['name', 'level', 'group']])
            ->assertJsonPath('0.name', 'Laravel')
            ->assertJsonPath('0.level', 70)
            ->assertJsonMissingPath('0.group_name');
    }

    public function test_unpublished_projects_are_hidden(): void
    {
        $this->getJson('/api/projects')->assertOk()->assertJsonCount(4);

        Project::query()->where('code', 'CASE 04')->update(['is_published' => false]);

        $this->getJson('/api/projects')->assertOk()->assertJsonCount(3)
            ->assertJsonStructure(['*' => ['code', 'tag', 'title', 'problem', 'built_with', 'result', 'github_url', 'demo_url']]);
    }

    public function test_contact_message_is_saved(): void
    {
        $this->postJson('/api/contact', [
            'name' => 'Sara',
            'email' => 'sara@example.com',
            'message' => 'I would like to talk about a project.',
        ])->assertCreated()->assertJsonStructure(['message']);

        $this->assertDatabaseHas('contact_messages', ['email' => 'sara@example.com']);
    }

    public function test_contact_validates_input(): void
    {
        $this->postJson('/api/contact', ['name' => '', 'email' => 'not-an-email', 'message' => 'short'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'message']);

        $this->assertSame(0, ContactMessage::count());
    }

    public function test_honeypot_stores_nothing(): void
    {
        $this->postJson('/api/contact', [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'message' => 'Buy cheap things at my website.',
            'website' => 'https://spam.example',
        ])->assertCreated();

        $this->assertSame(0, ContactMessage::count());
    }

    public function test_projects_have_slugs_and_image_fields(): void
    {
        $this->getJson('/api/projects')->assertOk()
            ->assertJsonStructure(['*' => ['slug', 'title', 'case_study', 'cover_url', 'gallery']])
            ->assertJsonPath('0.slug', 'restaurant-management-system')
            ->assertJsonPath('0.gallery', []);
    }

    public function test_project_slugs_stay_unique(): void
    {
        $a = Project::create(['code' => 'X', 'tag' => 't', 'title' => 'Same Name', 'problem' => 'p', 'built_with' => 'b', 'result' => 'r']);
        $b = Project::create(['code' => 'Y', 'tag' => 't', 'title' => 'Same Name', 'problem' => 'p', 'built_with' => 'b', 'result' => 'r']);

        $this->assertSame('same-name', $a->slug);
        $this->assertSame('same-name-2', $b->slug);
    }

    public function test_image_urls_are_relative_storage_paths(): void
    {
        \App\Models\Certificate::query()->first()->update(['image_path' => 'certificates/a.jpg']);

        $this->getJson('/api/certificates')->assertOk()
            ->assertJsonPath('0.image_url', '/storage/certificates/a.jpg')
            ->assertJsonPath('1.image_url', null);
    }
}
