FROM php:7.4-fpm-alpine

LABEL maintainer="Katie Schuler <kathryn.schuler@gmail.com>"

ADD ./www.conf /usr/local/etc/php-fpm.d/www.conf
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN addgroup -g 1000 exbuilder && adduser -G exbuilder -g exbuilder -s /bin/sh -D exbuilder

RUN mkdir -p /var/www/html

RUN chown exbuilder:exbuilder /var/www/html

WORKDIR /var/www/html

RUN set -ex \
  && apk --no-cache add \
    postgresql-dev

RUN docker-php-ext-install pdo pdo_pgsql pgsql
