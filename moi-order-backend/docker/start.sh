#!/bin/bash
set -e

# Substitute $PORT into nginx config at runtime (injected by Railway/Render)
sed -i "s/__PORT__/${PORT:-8080}/" /etc/nginx/nginx.conf

# Write Aiven CA cert if provided
if [ -n "$AIVEN_CA_CERT" ]; then
    echo "$AIVEN_CA_CERT" | base64 -d > /tmp/aiven-ca.crt
    export MYSQL_ATTR_SSL_CA=/tmp/aiven-ca.crt
fi

# Laravel bootstrap
php artisan storage:link --force
php artisan config:cache
# route:cache is intentionally omitted: the local-disk file-serving route
# (storage.local) is registered as a Closure by FilesystemServiceProvider and
# is skipped entirely when routes are cached, causing temporaryUrl() to throw
# InvalidArgumentException("Route [storage.local] not defined.") → 500 on every
# file-upload submission.  Once you switch FILESYSTEM_DISK=s3 the route is no
# longer needed and route:cache can be re-enabled.
php artisan view:cache
php artisan migrate --force

exec supervisord -c /etc/supervisord.conf
