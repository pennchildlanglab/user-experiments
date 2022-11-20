FROM nginx:stable-alpine

LABEL maintainer="Katie Schuler <kathryn.schuler@gmail.com>"

ADD ./nginx.conf /etc/nginx/nginx.conf
ADD ./default.conf /etc/nginx/conf.d/default.conf
ADD ./myexp.local.conf /etc/nginx/conf.d/myexp.local.conf

RUN mkdir -p /var/www/html

RUN addgroup -g 1000 exbuilder && adduser -G exbuilder -g exbuilder -s /bin/sh -D exbuilder

RUN chown exbuilder:exbuilder /var/www/html
