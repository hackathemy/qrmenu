# QR Menu System

- `apps/api`: API Server
- `apps/seller`: Seller Frontend
- `apps/web`: Customer Frontend
- `packages/api-client`: API Client Module
- `packages/store`: Global State Storage for Web
- `packages/type`: Shared Types

## PreRequirements
1. ```pnpm install``` in root directory.
2. required `.env` for each projects

## Run
```bash
# api
pnpm dev --filter @hackathon-qrmenu/api...
# web
pnpm dev --filter @hackathon-qrmenu/web...
# seller
pnpm dev --filter @hackathon-qrmenu/seller...
```


## Env

- `api`
```bash
NODE_ENV= 'local' # 'production' | 'development'

PORT=8000

JWT_SECRET=

# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=
DATABASE_NAME=qrmenu

# AWS S3 Credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
# 메뉴 등 이미지 저장 버켓
AWS_S3_BUCKET=
```

- `seller`
```bash
# API URL
NEXT_PUBLIC_API_URL=

# CDN URL (for contains file path from backend) ex) {S3_BUCKET_PUBLIC_URL}
NEXT_PUBLIC_CDN_URL=

# Project Self Base URL ex) http://localhost:3001
NEXT_PUBLIC_BASE_URL=

# Order Web(packages/web) URL (for qrcode scan)
NEXT_PUBLIC_WEB_URL=
```

- `web`
```bash
# API URL
NEXT_PUBLIC_API_URL=

# CDN URL (for contains file path from backend) ex) {S3_BUCKET_PUBLIC_URL}
NEXT_PUBLIC_CDN_URL=

# 한국수출입은행 OPEN AUTH KEY - 환율 적용
KOREA_EXIM_AUTH_KEY=
```