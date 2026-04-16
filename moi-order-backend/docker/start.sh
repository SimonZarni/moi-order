#!/bin/bash
set -e

echo "🚀 Starting Laravel application on Railway..."

# === CRITICAL FIX: Nginx temp directories ===
mkdir -p /var/lib/nginx/tmp/client_body /var/lib/nginx/tmp/proxy /var/lib/nginx/tmp/fastcgi /tmp/client_body
chown -R nginx:nginx /var/lib/nginx/tmp /tmp/client_body
chmod -R 777 /var/lib/nginx/tmp /tmp/client_body

# === CRITICAL FIX: PHP-FPM socket directory ===
mkdir -p /var/run/php
chown -R www-data:www-data /var/run/php
chmod -R 755 /var/run/php

# Prepare Nginx port (replaces __PORT__ placeholder)
sed -i "s/__PORT__/${PORT:-8080}/" /etc/nginx/nginx.conf

# Database SSL (Aiven)
if [ -n "$AIVEN_CA_CERT" ]; then
    echo "$AIVEN_CA_CERT" | base64 -d > /tmp/aiven-ca.crt
    export MYSQL_ATTR_SSL_CA=/tmp/aiven-ca.crt
fi

# Laravel private storage directory for submissions
mkdir -p /var/www/html/storage/app/private/submissions/documents
chown -R www-data:www-data /var/www/html/storage/app/private
chmod -R 775 /var/www/html/storage/app/private

# Laravel optimizations & migrations
cd /var/www/html
php artisan storage:link --force
php artisan config:cache
php artisan view:cache
php artisan migrate --force
php artisan db:seed --class=TicketSeeder --force

echo "✅ Starting Supervisor (PHP-FPM + Nginx + Queue)..."
exec supervisord -c /etc/supervisord.conf
