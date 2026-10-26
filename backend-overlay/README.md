# Backend overlay (Laravel API)

This folder holds only the portfolio-specific code. It is applied on top of a
fresh Laravel app, so you always get the newest Laravel and your own `vendor/`.

## What is inside

| Path | Purpose |
| --- | --- |
| `database/migrations/..._create_portfolio_tables.php` | 9 MySQL tables |
| `database/migrations/..._add_images_and_case_studies.php` | Image uploads and project case studies (adds columns, keeps your data) |
| `app/Models/*` | One model per table |
| `app/Http/Controllers/Api/PortfolioController.php` | Public read-only endpoints |
| `app/Http/Controllers/Api/ContactController.php` | Contact form (validation, honeypot, optional email) |
| `routes/api.php` | The routes |
| `database/seeders/*` | Your real content as starting data |
| `config/portfolio.php` | `PORTFOLIO_CONTACT_TO` email setting |
| `tests/Feature/PortfolioApiTest.php` | 12 API tests |
| `app/Filament/Resources/*` | Admin panel: 9 screens (profile, academic cards, timeline, services, skills, projects, experience, certificates, messages) |
| `app/Models/User.php` | Lets your admin account open the panel in production |

## Endpoints

`GET /api/health`, `/api/profile`, `/api/academics`, `/api/timeline`,
`/api/services`, `/api/skills`, `/api/projects`, `/api/experiences`,
`/api/certificates` and `POST /api/contact` (5 per 10 minutes per visitor).

## Run it

macOS / Linux / Git Bash: `./setup-backend.sh` from the project root.

Windows PowerShell, from the project root:

```powershell
composer create-project laravel/laravel:^12.0 backend
cd backend
php artisan install:api --no-interaction
composer require "filament/filament:~3.3" -W
php artisan filament:install --panels --no-interaction
Copy-Item -Recurse -Force ..\backend-overlay\* .

# Tests must never touch your MySQL data: switch on the in-memory test database.
(Get-Content phpunit.xml -Raw) -replace '<!--\s*(<env name="DB_(CONNECTION|DATABASE)" value="[^"]*"\s*/>)\s*-->','$1' | Set-Content phpunit.xml
```

If PHP is 8.5, also replace `PDO::MYSQL_ATTR_SSL_CA` in `config/database.php` with
`(PHP_VERSION_ID >= 80400 ? \Pdo\Mysql::ATTR_SSL_CA : \PDO::MYSQL_ATTR_SSL_CA)`
(otherwise you only see harmless deprecation warnings).

```powershell
```

Then create a MySQL database called `azhar_portfolio` and set these in
`backend/.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=azhar_portfolio
DB_USERNAME=root
DB_PASSWORD=
PORTFOLIO_CONTACT_TO=you@example.com
```

```
php artisan migrate --seed
php artisan storage:link
php artisan make:filament-user
php artisan serve
php artisan test
```

Open http://127.0.0.1:8000/api/skills to check it. The React app in
`frontend/` proxies `/api` to this server during development.

## Notes

- `php artisan test` uses in-memory SQLite, so it needs no MySQL.
- `PortfolioSeeder` replaces the content tables. Run it once at the start, then
  edit content from the admin panel (next step) and do not seed again.
- To allow only your site, run `php artisan config:publish cors` and set
  `allowed_origins` to your frontend domain before going live.

## Admin panel

Open http://127.0.0.1:8000/admin and sign in with the account you created with
`make:filament-user`. Add a certificate, project, skill or timeline entry with
the form and it shows up on the website straight away, with no code change and
no redeploy. Drag the rows to change their order. The Messages screen shows
what visitors send through the contact form (a badge counts the unread ones).

- Upload your photo in **Profile**. The site picks it up from the API.
- Use a strong password. In production serve the admin over HTTPS only.
- New items appear at the top of their list until you drag them into place.
