#!/bin/bash
set -e

sed -i "s/__PORT__/${PORT:-8080}/" /etc/nginx/nginx.conf

if [ -n "$AIVEN_CA_CERT" ]; then
    echo "$AIVEN_CA_CERT" | base64 -d > /tmp/aiven-ca.crt
    export MYSQL_ATTR_SSL_CA=/tmp/aiven-ca.crt
fi

# Recreate subdirs inside the mounted volume on every start
mkdir -p storage/app/private/submissions/documents
chmod -R 775 storage/app/private
chown -R www-data:www-data storage/app/private

php artisan storage:link --force
php artisan config:cache
php artisan view:cache
php artisan migrate --force

exec supervisord -c /etc/supervisord.conf
