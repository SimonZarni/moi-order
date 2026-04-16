#!/bin/bash
set -e

# 1. Prepare Nginx Port
sed -i "s/__PORT__/${PORT:-8080}/" /etc/nginx/nginx.conf

# 2. Database SSL (Aiven)
if [ -n "$AIVEN_CA_CERT" ]; then
    echo "$AIVEN_CA_CERT" | base64 -d > /tmp/aiven-ca.crt
    export MYSQL_ATTR_SSL_CA=/tmp/aiven-ca.crt
fi

# 3. VOLUME PERMISSIONS (Crucial for Docker)
# Recreate the directory structure inside the mounted volume
mkdir -p /var/www/html/storage/app/private/submissions/documents

# Set ownership to the user running PHP-FPM (www-data)
chown -R www-data:www-data /var/www/html/storage/app/private
chmod -R 775 /var/www/html/storage/app/private

# 4. Laravel Optimizations
# We run these from /var/www/html
cd /var/www/html
php artisan storage:link --force
php artisan config:cache
php artisan view:cache
php artisan migrate --force

# 5. Start Supervisor
exec supervisord -c /etc/supervisord.conf
