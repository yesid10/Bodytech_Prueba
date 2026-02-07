#!/bin/bash

set -e

# Ensure .env file exists
if [ ! -f "/var/www/html/.env" ]; then
  echo "Creating .env file..."
  touch /var/www/html/.env
  chmod 644 /var/www/html/.env
  cat > /var/www/html/.env << 'ENVFILE'
APP_NAME=TaskManager
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_KEY=base64:0000000000000000000000000000000000000000000=
LOG_CHANNEL=stack
LOG_LEVEL=debug
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=tasksdb
DB_USERNAME=taskuser
DB_PASSWORD=taskpassword123
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
ENVFILE
fi

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
