FROM mongo:bionic
ENV SEED_DIR="/seed"
COPY ["pages.json", "captures.json", "/seed/"]
COPY ["seed.sh", "/docker-entrypoint-initdb.d/"]
