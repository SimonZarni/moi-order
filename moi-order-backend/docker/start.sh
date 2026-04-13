#!/bin/bash
set -e

# Substitute $PORT into nginx config at runtime (Render sets this env var)
sed -i "s/__PORT__/${PORT:-8080}/" /etc/nginx/nginx.conf

# PHP-FPM socket path
sed -i 's|listen = 127.0.0.1:9000|listen = /var/run/php-fpm.sock|' \
    /usr/local/etc/php-fpm.d/www.conf
echo "listen.owner = www-data"  >> /usr/local/etc/php-fpm.d/www.conf
echo "listen.group = www-data"  >> /usr/local/etc/php-fpm.d/www.conf
echo "listen.mode = 0660"       >> /usr/local/etc/php-fpm.d/www.conf

# Laravel bootstrap
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

exec supervisord -c /etc/supervisord.conf
