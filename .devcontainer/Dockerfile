# Poste de travail : Node 24 sur Debian trixie, même base que la CI (node:24-trixie)
FROM mcr.microsoft.com/devcontainers/typescript-node:24-trixie

# Miroir apt français, puis client PostgreSQL (utile si une base est ajoutée plus tard)
RUN sed -i 's|deb.debian.org|ftp.fr.debian.org|g' /etc/apt/sources.list.d/debian.sources \
  && apt-get update \
  && apt-get install -y --no-install-recommends postgresql-client \
  && rm -rf /var/lib/apt/lists/*
