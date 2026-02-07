FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    netcat-traditional \
    && docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy entire application code
COPY . .

# Ensure .env exists (copy from .env if exists, otherwise create minimal)
RUN if [ ! -f /var/www/html/.env ]; then cp -v /var/www/html/.env.example /var/www/html/.env 2>/dev/null || echo "APP_NAME=TaskManager\nAPP_ENV=local\nAPP_DEBUG=true\nAPP_KEY=\nDB_CONNECTION=pgsql\nDB_HOST=db\nDB_PORT=5432\nDB_DATABASE=tasksdb\nDB_USERNAME=taskuser\nDB_PASSWORD=taskpassword123" > /var/www/html/.env; fi

# Install PHP dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Copy entrypoint script (already in COPY . .)
RUN chmod +x /var/www/html/entrypoint.sh

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Expose port 9000 and start php-fpm server
EXPOSE 9000
ENTRYPOINT ["/var/www/html/entrypoint.sh"]