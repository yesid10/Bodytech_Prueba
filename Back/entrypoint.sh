#!/bin/bash

set -e

# Install composer dependencies if vendor doesn't exist
if [ ! -d "/var/www/html/vendor" ]; then
  echo "Installing Composer dependencies..."
  composer install --no-interaction --optimize-autoloader --no-dev
fi

# Wait for database to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Generate app key if not exists
if [ -z "$APP_KEY" ]; then
  echo "Generating APP_KEY..."
  php artisan key:generate
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Generate JWT secret
echo "Generating JWT secret..."
php artisan jwt:secret --force 2>/dev/null || true

echo "Starting PHP-FPM..."

# Start PHP-FPM
exec php-fpm
