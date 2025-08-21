FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

RUN set -eux; \
    ARCH=$(uname -m); \
    case "$ARCH" in \
    x86_64)   MIGRATE_ARCH="amd64" ;; \
    aarch64)  MIGRATE_ARCH="arm64" ;; \
    *)        echo "Unsupported architecture: $ARCH"; exit 1 ;; \
    esac; \
    curl -L https://github.com/golang-migrate/migrate/releases/latest/download/migrate.linux-${MIGRATE_ARCH}.tar.gz > /tmp/migrate.tar.gz; \
    tar -xzf /tmp/migrate.tar.gz -C /usr/local/bin/; \
    rm /tmp/migrate.tar.gz
