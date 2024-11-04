FROM nginx:1

ENV TZ Europe/Warsaw
ENV PACKAGE_NAME dashboard

WORKDIR /usr/share/nginx/html

COPY ./dist .
COPY ./default.conf /etc/nginx/conf.d
