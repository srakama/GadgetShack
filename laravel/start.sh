#!/usr/bin/env sh
set -e

if [ -n "${RENDER_EXTERNAL_URL}" ] && [ -z "${APP_URL}" ]; then
  export APP_URL="${RENDER_EXTERNAL_URL}"
fi

php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

php artisan migrate --force || true

php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

exec supervisord -c /etc/supervisord.conf
