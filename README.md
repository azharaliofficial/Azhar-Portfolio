# Azhar Ali Portfolio

React + Tailwind frontend, Laravel API, MySQL, and a Filament admin panel so new
achievements can be added without touching code.

```
frontend/          React (Vite), Tailwind v4, Framer Motion
backend-overlay/   Laravel code: migration, models, API, seeders, tests, admin screens
setup-backend.sh   Builds backend/ = fresh Laravel + the overlay
```

## What is tested, and what is not

| Part | Status |
| --- | --- |
| Frontend build, mobile and desktop layout, mobile menu, scroll animations | Built and checked in a real browser |
| Images, case-study pages, Ctrl+K search, terminal, live GitHub feed | Checked in a real browser against a mock API (desktop and mobile) |
| Frontend against a mock API: live data, photo from API, API panel, contact form (success and error), honeypot | Checked in a real browser |
| Seeder data vs the frontend's data (all 8 resources) | Compared automatically, identical |
| All PHP files | Syntax-checked (`php -l`) |
| Laravel API, first migration, seeding, Filament admin login and menu | Run on a real Windows machine (PHP 8.5, MySQL, Laravel 12, Filament 3.3.57) |
| Image uploads, new migration, case-study fields, 12 tests | **Not run yet.** See "Updating an existing install" below, then run `php artisan test` and send me any error. |

## Quick start (your computer)

Needs PHP 8.2+, Composer, Node 20+, MySQL.

```bash
./setup-backend.sh                  # or the PowerShell steps in backend-overlay/README.md
# create an empty MySQL database "azhar_portfolio", set DB_* in backend/.env
cd backend
php artisan migrate --seed
php artisan storage:link
php artisan make:filament-user      # your admin login
php artisan test                    # 9 tests, should all pass
php artisan serve                   # API on :8000, admin on :8000/admin

# second terminal
cd frontend
npm install
npm run dev                         # site on http://localhost:5173
```

The site shows built-in content immediately, then swaps in live data once the
API answers, so it never looks empty even while a free backend is waking up.

## What the site does

- **Images from the admin:** profile gallery ("Moments"), project cover and screenshots, certificate image, timeline and experience photos. Click any image to open it full size.
- **Case-study pages:** every project has its own page at `#/p/<slug>` with the problem, stack, result, a longer story and screenshots. Written in admin, Projects.
- **Terminal:** visitors type `help`, `skills`, `projects`, `open 1`, `goto contact`, and more. Chips make it work on phones.
- **Ctrl+K search:** jump to any section, project, skill or certificate. A search button is in the navbar.
- **Live GitHub:** latest commits and repos come straight from your public GitHub (no key needed, cached 10 minutes). Hidden if GitHub is unreachable.

## Updating an existing install (you already ran the first version)

From the project root, copy the new code over your backend, then migrate. **Do not run `migrate:fresh` or `--seed`**: that deletes the content you added in admin.

```powershell
Copy-Item -Recurse -Force .\backend-overlay\* .\backend\
cd backend
php artisan migrate
php artisan test
```

Keep `php artisan serve` and `npm run dev` running. In admin, open Projects, Certificates, Timeline, Experience or Profile and you will see the new upload fields.

## Things only you can fill in

- [ ] Photo: upload in admin (Profile), or drop `frontend/public/profile.jpg`
- [ ] Screenshots for each project, and an image for each certificate (admin)
- [ ] LinkedIn link and resume PDF link (admin, Profile)
- [ ] The PROBLEM / BUILT WITH / RESULT lines of the 4 projects (admin, Projects). They are placeholders until the repos are reviewed
- [ ] Certificate links for the VERIFY buttons (admin, Certificates)
- [ ] Domain name, then the canonical and og:image tags in `frontend/index.html`
- [ ] Mail: set `PORTFOLIO_CONTACT_TO` (and Laravel mail settings) to get emails; messages are always saved in admin

## Going live

**Frontend (Vercel or Netlify, free)**
1. Import the repo, set the root directory to `frontend`.
2. Build command `npm run build`, output `dist`.
3. Environment variable `VITE_API_URL=https://api.yourdomain.com`.

**Backend (any PHP + MySQL host: shared hosting, Render, Railway, a VPS)**
1. Upload `backend/`, point the web root at `backend/public`.
2. `.env`: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, `DB_*`, a new `APP_KEY` (`php artisan key:generate`).
3. `composer install --no-dev --optimize-autoloader`, then `php artisan migrate --seed` once, `php artisan storage:link`, `php artisan make:filament-user`.
4. `php artisan config:cache && php artisan route:cache`.
5. Allow only your site: `php artisan config:publish cors`, set `allowed_origins` to your frontend domain.
6. Serve over HTTPS only. The admin lives at `/admin`.

Free tiers sleep when idle, so the first visit can take 30 to 60 seconds. The
frontend's built-in content covers that gap.

## Adding things later

Admin panel, no code: new certificate, project, skill, timeline entry, service or
experience. Drag rows to reorder. The journey timeline, skill bars and API panel
update from the same data.
