#!/bin/bash
set -e

echo "Starting Laravel application on Railway..."

# === CRITICAL FIX: Fix Nginx temp directories at runtime (extra safety) ===
mkdir -p /var/lib/nginx/tmp/client_body /var/lib/nginx/tmp/proxy /var/lib/nginx/tmp/fastcgi /tmp/client_body
chown -R nginx:nginx /var/lib/nginx/tmp /tmp/client_body
chmod -R 777 /var/lib/nginx/tmp /tmp/client_body

# Prepare Nginx configuration (replace __PORT__ with actual PORT)
sed -i "s/__PORT__/${PORT:-8080}/" /etc/nginx/nginx.conf

# Database SSL setup (Aiven)
if [ -n "$AIVEN_CA_CERT" ]; then
    echo "$AIVEN_CA_CERT" | base64 -d > /tmp/aiven-ca.crt
    export MYSQL_ATTR_SSL_CA=/tmp/aiven-ca.crt
fi

# Create Laravel private storage directory for submissions
mkdir -p /var/www/html/storage/app/private/submissions/documents
chown -R www-data:www-data /var/www/html/storage/app/private
chmod -R 775 /var/www/html/storage/app/private

# Laravel optimizations and migrations
cd /var/www/html

php artisan storage:link --force
php artisan config:cache
php artisan view:cache
php artisan migrate --force

echo "Starting Supervisor (Nginx + PHP-FPM)..."

# Start supervisor (which runs nginx + php-fpm)
exec supervisord -c /etc/supervisord.conf
