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
pnpm dev --filter @hackathon/api...
# web
pnpm dev --filter @hackathon/web...
# seller
pnpm dev --filter @hackathon/seller...
```