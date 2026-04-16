# ── Build stage ──────────────────────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS build

WORKDIR /var/www/html

# System deps + PHP extensions
RUN apk add --no-cache \
        bash \
        curl \
        git \
        libpng-dev \
        libzip-dev \
        oniguruma-dev \
        postgresql-dev \
        unzip \
    && docker-php-ext-install \
        bcmath \
        mbstring \
        opcache \
        pcntl \
        pdo_mysql \
        zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy dependency manifests first (layer caching)
COPY composer.json composer.lock ./

RUN composer install \
        --no-dev \
        --no-scripts \
        --no-autoloader \
        --prefer-dist \
        --no-interaction

# Copy application source
COPY . .

# Finalise autoloader + run post-install scripts
RUN composer dump-autoload --optimize --no-dev \
    && php artisan package:discover --ansi

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS runtime

WORKDIR /var/www/html

# Nginx + supervisor to manage PHP-FPM + Nginx in one container
RUN apk add --no-cache \
        bash \
        nginx \
        oniguruma-dev \
        postgresql-libs \
        supervisor

# PHP extensions needed at runtime
RUN apk add --no-cache \
        libpng-dev \
        libzip-dev \
        oniguruma-dev \
    && docker-php-ext-install \
        bcmath \
        mbstring \
        opcache \
        pcntl \
        pdo_mysql \
        zip

# === CRITICAL FIX: Create and fix permissions for Nginx temp directories ===
RUN mkdir -p /var/lib/nginx/tmp/client_body \
             /var/lib/nginx/tmp/proxy \
             /var/lib/nginx/tmp/fastcgi \
             /tmp/client_body \
    && chown -R nginx:nginx /var/lib/nginx/tmp \
    && chmod -R 777 /var/lib/nginx/tmp \
    && chown -R nginx:nginx /tmp/client_body \
    && chmod -R 777 /tmp

# OPcache tuning for production
RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.interned_strings_buffer=8'; \
        echo 'opcache.max_accelerated_files=10000'; \
        echo 'opcache.revalidate_freq=0'; \
        echo 'opcache.validate_timestamps=0'; \
    } > /usr/local/etc/php/conf.d/opcache.ini

# Copy built app from build stage
COPY --from=build /var/www/html /var/www/html

# PHP runtime settings (upload limits, memory)
COPY docker/php.ini /usr/local/etc/php/conf.d/app.ini

# PHP-FPM pool overrides
COPY docker/fpm-pool.conf /usr/local/etc/php-fpm.d/zz-app.conf

# Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Supervisor config
COPY docker/supervisord.conf /etc/supervisord.conf

# Writable directories for Laravel
RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Railway injects PORT at runtime
ENV PORT=8080

EXPOSE 8080

# Entrypoint script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
