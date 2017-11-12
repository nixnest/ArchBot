FROM ruby:2.4-alpine3.6

RUN mkdir /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN apk update && \
    apk add ruby-dev build-base curl-dev && \
    bundle install --gemfile=/usr/src/app/Gemfile && \
    rm -rf /var/cache/apk/*

ENTRYPOINT ["./main.rb"]
