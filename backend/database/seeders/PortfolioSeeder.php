<?php

namespace Database\Seeders;

use App\Models\Academic;
use App\Models\Certificate;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\TimelineEvent;
use Illuminate\Database\Seeder;

/**
 * Starting content, the same as the React fallback data. Safe to run again:
 * it replaces these tables. After launch, edit content in the admin panel
 * instead and do not re-run this seeder.
 */
class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([Profile::class, Academic::class, TimelineEvent::class, Service::class,
            Skill::class, Project::class, Experience::class, Certificate::class] as $model) {
            $model::query()->delete();
        }

        Profile::create([
            'name' => 'Azhar Ali',
            'role' => 'Developer',
            'location' => 'Skardu, Pakistan',
            'headline' => 'Turning ideas into products.',
            'bio' => 'I am Azhar Ali, a Computer Science student building backend-first web applications with Laravel, MySQL, Python and React.',
            'github_url' => 'https://github.com/azharaliofficial',
            'linkedin_url' => null,
            'resume_url' => null,
        ]);

        $this->fill(Academic::class, [
            ['position' => 'tl', 'kind' => 'DIPLOMA · 2022', 'title' => 'Computer Diploma', 'subtitle' => "Challenger's Computer Skills"],
            ['position' => 'tr', 'kind' => 'EDUCATION · 2024 - 2028', 'title' => 'BSCS, Computer Science', 'subtitle' => 'GCU Faisalabad'],
            ['position' => 'bl', 'kind' => 'TRAINING · 2025', 'title' => 'Full-Stack Web Development', 'subtitle' => 'Tech Zone Institute'],
            ['position' => 'br', 'kind' => 'CERTIFIED · 2026', 'title' => 'AI and Data Analytics', 'subtitle' => 'DigiSkills.pk, VitaNova'],
        ]);

        $this->fill(TimelineEvent::class, [
            ['date_label' => 'OCT 2022', 'title' => 'Computer Diploma', 'description' => "Challenger's Computer Skills Centre. Windows, MS Office, typing.", 'is_current' => false],
            ['date_label' => 'SEP 2024', 'title' => 'BSCS begins', 'description' => 'Government College University Faisalabad, Computer Science.', 'is_current' => false],
            ['date_label' => 'DEC 2024', 'title' => 'Baltistan Student Council', 'description' => 'First certificate for teamwork and active contribution.', 'is_current' => false],
            ['date_label' => 'SEP 2025', 'title' => 'Full-Stack Web Development', 'description' => 'Tech Zone Institute. 3-month program plus a 1-month internship.', 'is_current' => false],
            ['date_label' => 'DEC 2025', 'title' => 'Team leadership', 'description' => 'Baltistan Student Council GCUF recognises leadership contribution.', 'is_current' => false],
            ['date_label' => 'APR 2026', 'title' => 'Hands-on AI training', 'description' => 'VitaNova International Alliance for Sciences (VNIAS).', 'is_current' => false],
            ['date_label' => 'APR - JUL 2026', 'title' => 'DigiSkills program', 'description' => 'Data Analytics and BI, and AI using Python.', 'is_current' => false],
            ['date_label' => 'NOW', 'title' => 'CodeAlpha backend internship', 'description' => 'Restaurant Management, Event Registration, URL Shortener.', 'is_current' => true],
        ]);

        $this->fill(Service::class, [
            ['code' => 'S-01', 'title' => 'Laravel web apps and admin panels', 'description' => 'Business systems like restaurant, event and shop management, with a clean admin to run them.', 'stack' => 'Laravel · PHP · MySQL'],
            ['code' => 'S-02', 'title' => 'REST APIs and backend', 'description' => 'Secure, documented APIs with a well designed database behind them.', 'stack' => 'Laravel · MySQL · Sanctum'],
            ['code' => 'S-03', 'title' => 'Full-stack web (Laravel + React)', 'description' => 'Responsive websites and dashboards, from the database to the screen.', 'stack' => 'React · Tailwind · Laravel'],
            ['code' => 'S-04', 'title' => 'Python automation and data', 'description' => 'Scripts that save time, data dashboards and small AI features.', 'stack' => 'Python · Analytics · AI basics'],
        ]);

        $this->fill(Skill::class, [
            ['name' => 'Laravel', 'level' => 70, 'group_name' => 'Backend'],
            ['name' => 'PHP', 'level' => 70, 'group_name' => 'Backend'],
            ['name' => 'HTML, CSS and Tailwind', 'level' => 70, 'group_name' => 'Frontend'],
            ['name' => 'MySQL', 'level' => 65, 'group_name' => 'Database'],
            ['name' => 'Python', 'level' => 65, 'group_name' => 'Backend'],
            ['name' => 'JavaScript', 'level' => 60, 'group_name' => 'Frontend'],
            ['name' => 'C++ and OOP', 'level' => 60, 'group_name' => 'Core'],
            ['name' => 'React', 'level' => 55, 'group_name' => 'Frontend'],
            ['name' => 'Data Analytics and BI', 'level' => 55, 'group_name' => 'Data'],
            ['name' => 'AI and Machine Learning', 'level' => 50, 'group_name' => 'Data'],
        ]);

        // The problem / built_with / result lines are placeholders: fill them in
        // from the admin panel once the repositories have been reviewed.
        $this->fill(Project::class, [
            ['code' => 'CASE 01', 'tag' => 'CODEALPHA INTERNSHIP', 'title' => 'Restaurant Management System', 'problem' => '[One line: what a restaurant needed to manage.]', 'built_with' => '[Stack and database design.]', 'result' => '[Demo video, tables and reservations.]', 'github_url' => 'https://github.com/azharaliofficial', 'demo_url' => null],
            ['code' => 'CASE 02', 'tag' => 'CODEALPHA INTERNSHIP', 'title' => 'Event Registration', 'problem' => '[One line: how people sign up for events.]', 'built_with' => '[Stack and database design.]', 'result' => '[Screenshot or demo.]', 'github_url' => 'https://github.com/azharaliofficial', 'demo_url' => null],
            ['code' => 'CASE 03', 'tag' => 'CODEALPHA INTERNSHIP', 'title' => 'URL Shortener', 'problem' => '[One line: why short links.]', 'built_with' => '[Stack and database design.]', 'result' => '[Screenshot or demo.]', 'github_url' => 'https://github.com/azharaliofficial', 'demo_url' => null],
            ['code' => 'CASE 04', 'tag' => 'PERSONAL PROJECT', 'title' => 'E-shop Dashboard', 'problem' => '[One line: what the shop owner sees.]', 'built_with' => '[Stack and database design.]', 'result' => '[Screenshot or demo.]', 'github_url' => 'https://github.com/azharaliofficial', 'demo_url' => null],
        ]);

        $this->fill(Experience::class, [
            ['type' => 'INTERNSHIP', 'role' => 'Backend Development Intern', 'org' => 'CodeAlpha', 'summary' => 'Built three backend projects: Restaurant Management, Event Registration and URL Shortener.'],
            ['type' => 'INTERNSHIP', 'role' => 'Full-Stack Web Development Intern', 'org' => 'Tech Zone Institute', 'summary' => 'One month applying full-stack skills in real project environments after a 3-month program.'],
            ['type' => 'LEADERSHIP', 'role' => 'Baltistan Student Council', 'org' => 'GCUF · 2024 and 2025', 'summary' => 'Recognised for teamwork in 2024 and team leadership in 2025.'],
        ]);

        $this->fill(Certificate::class, [
            ['title' => 'Full-Stack Web Development', 'issuer' => 'Tech Zone Institute', 'date_label' => 'Sep 2025', 'link_label' => 'VIEW', 'url' => null],
            ['title' => 'Hands-On AI Training', 'issuer' => 'VitaNova (VNIAS)', 'date_label' => 'Apr 2026', 'link_label' => 'VIEW', 'url' => null],
            ['title' => 'Data Analytics and Business Intelligence', 'issuer' => 'DigiSkills.pk', 'date_label' => 'Jul 2026', 'link_label' => 'VERIFY', 'url' => null],
            ['title' => 'Artificial Intelligence using Python', 'issuer' => 'DigiSkills.pk', 'date_label' => 'Jul 2026', 'link_label' => 'VERIFY', 'url' => null],
            ['title' => 'Teamwork and Team Leadership', 'issuer' => 'Baltistan Student Council GCUF', 'date_label' => '2024, 2025', 'link_label' => 'VIEW', 'url' => null],
            ['title' => 'Computer Diploma', 'issuer' => "Challenger's Computer Skills Centre", 'date_label' => 'Oct 2022', 'link_label' => 'VIEW', 'url' => null],
        ]);
    }

    /**
     * Insert rows in the order given, using the position as sort_order.
     *
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $model
     * @param  array<int, array<string, mixed>>  $rows
     */
    private function fill(string $model, array $rows): void
    {
        foreach ($rows as $index => $row) {
            $model::create($row + ['sort_order' => $index]);
        }
    }
}
