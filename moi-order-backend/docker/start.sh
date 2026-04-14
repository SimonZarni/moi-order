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

# Write Aiven CA cert if provided
if [ -n "$AIVEN_CA_CERT" ]; then
    echo "$AIVEN_CA_CERT" | base64 -d > /tmp/aiven-ca.crt
    export MYSQL_ATTR_SSL_CA=/tmp/aiven-ca.crt
fi

# Laravel bootstrap
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

exec supervisord -c /etc/supervisord.conf
