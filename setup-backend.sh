#!/usr/bin/env bash
# Creates the Laravel app in ./backend and applies the portfolio code on top.
# Needs: PHP 8.2+, Composer, and a MySQL database (see backend-overlay/README.md).
set -euo pipefail

cd "$(dirname "$0")"

if [ -d backend ] && [ -f backend/artisan ]; then
  echo "backend/ already exists, skipping create-project."
else
  rm -rf backend
  # Laravel 12: Filament 3.3 (the admin panel used here) does not support Laravel 13 yet.
  composer create-project laravel/laravel:^12.0 backend --no-interaction
fi

cd backend

# Laravel 11+ ships without an API layer. This adds routes/api.php and Sanctum.
php artisan install:api --no-interaction

# Admin panel (Filament 3). Installed before the overlay so its classes exist.
composer require "filament/filament:~3.3" -W --no-interaction
php artisan filament:install --panels --no-interaction

# Apply the portfolio code (models, migration, controllers, routes, seeders,
# tests and the admin resources).
cp -R ../backend-overlay/. .

# Tests must NEVER run on your real MySQL data (they wipe tables). Laravel ships
# the in-memory test database lines commented out, so switch them on.
sed -i -E 's#<!--\s*(<env name="DB_(CONNECTION|DATABASE)" value="[^"]*"\s*/>)\s*-->#\1#' phpunit.xml

# PHP 8.5 renamed a PDO constant used by Laravel's config/database.php.
sed -i 's#PDO::MYSQL_ATTR_SSL_CA#(PHP_VERSION_ID >= 80400 ? \\Pdo\\Mysql::ATTR_SSL_CA : \\PDO::MYSQL_ATTR_SSL_CA)#g' config/database.php

echo
echo "Done. Next:"
echo "  1. Create an empty MySQL database named azhar_portfolio"
echo "  2. Edit backend/.env  (DB_CONNECTION=mysql, DB_DATABASE, DB_USERNAME, DB_PASSWORD)"
echo "  3. cd backend"
echo "     php artisan migrate --seed"
echo "     php artisan storage:link"
echo "     php artisan make:filament-user      # your admin login"
echo "     php artisan serve                   # admin at http://127.0.0.1:8000/admin"
echo "  4. In another terminal: cd frontend && npm install && npm run dev"
