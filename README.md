# QR Menu System

- `apps/api`: API Server
- `apps/seller`: Seller Frontend
- `apps/web`: Customer Frontend
- `packages/api-client`: API Client Module
- `packages/store`: Global State Storage for Web
- `packages/type`: Shared Types

## PreRequirements

1. `pnpm install` in root directory.
2. required `.env` for each projects

## Run

```bash
# api
pnpm dev:api
# web
pnpm dev:web
# seller
pnpm dev:seller
```

## Dev Setup Guide

```bash
# Postgres 디비 구동
docker compose up
# 서버 실행
pnpm dev:api
# 웹 실행
pnpm dev:web
# 셀러 실행
pnpm dev:seller
```

## Env

- `api`

```bash
NODE_ENV= 'local' # 'production' | 'development'

PORT=8000

JWT_SECRET=qrmenu

# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres
```

- `seller`

```bash
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# CDN URL (for contains file path from backend) ex) {S3_BUCKET_PUBLIC_URL}
NEXT_PUBLIC_CDN_URL=http://localhost:8000

# Project Self Base URL ex) http://localhost:3001
NEXT_PUBLIC_BASE_URL=http://localhost:3002

# Order Web(packages/web) URL (for qrcode scan)
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

- `web`

```bash
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# CDN URL (for contains file path from backend) ex) {S3_BUCKET_PUBLIC_URL}
NEXT_PUBLIC_CDN_URL=http://localhost:8000

# 한국수출입은행 OPEN AUTH KEY - 환율 적용
KOREA_EXIM_AUTH_KEY=
```
