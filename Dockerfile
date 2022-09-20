FROM alpine:3.16

RUN apk --update add --no-cache jq curl && \
    rm -rf /var/cache/apk/*

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]