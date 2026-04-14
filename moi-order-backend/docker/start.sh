#!/bin/bash
set -e

# Substitute $PORT into nginx config at runtime (Render sets this env var)
sed -i "s/__PORT__/${PORT:-8080}/" /etc/nginx/nginx.conf

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
