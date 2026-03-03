FROM php:8.4-fpm-alpine

WORKDIR /var/www/html

RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    git \
    curl \
    icu-dev \
    libzip-dev \
    oniguruma-dev \
    postgresql-client \
    postgresql-dev \
    nodejs \
    npm \
    && docker-php-ext-install pdo pdo_pgsql intl zip \
    && rm -rf /var/cache/apk/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY laravel/composer.json laravel/composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader --no-scripts

COPY laravel/package.json laravel/package-lock.json ./
RUN npm ci

COPY laravel/ .

RUN npm run build \
    && rm -rf node_modules

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

COPY laravel/nginx.conf /etc/nginx/http.d/default.conf
COPY laravel/supervisord.conf /etc/supervisord.conf
COPY laravel/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
