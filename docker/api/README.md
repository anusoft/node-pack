# docker/api/README.md

This directory contains Dockerfiles for packaging the API application (`apps/api`).

## Build Commands

Build these images from the **project root directory**.

### Standard Build
```bash
docker build -f docker/api/Dockerfile.standard -t api:standard .
```

### Distroless Build
```bash
docker build -f docker/api/Dockerfile.distroless -t api:distroless .
```

### Multi-stage Build
```bash
docker build -f docker/api/Dockerfile.multistage -t api:multistage .
```

## Running Containers (Example)
```bash
# Make sure to pass the DATABASE_URL environment variable for Prisma
docker run -d -p 3001:3001 -e PORT=3001 -e DATABASE_URL="your_db_connection_string" api:standard
```
