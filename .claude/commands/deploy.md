---
description: Build and deploy to production server
---

# Deploy to Production

Deploy YTY TaskFlow to production server (172.22.22.11:4200/taskflow/)

## Pre-deployment:
1. Verify all TypeScript compiles: `cd backend && npx tsc --noEmit`
2. Verify frontend builds: `cd frontend && npm run build`
3. Check `.env.production` files exist in both backend/ and frontend/
4. Run `git status` to ensure clean working directory

## Build Steps:
1. Build backend: `cd backend && npm run build`
2. Build frontend: `cd frontend && npm run build`
3. Docker build: `docker-compose -f docker-compose.prod.yml build`

## Deploy Steps:
1. Push to production: `docker-compose -f docker-compose.prod.yml up -d`
2. Run database sync: `docker exec taskflow-backend npx prisma db push`
3. Verify health: `curl http://172.22.22.11:4200/taskflow/api/v1/health`

## Post-deployment:
1. Check backend logs: `docker logs taskflow-backend --tail 50`
2. Check frontend loads: verify http://172.22.22.11:4200/taskflow/
3. Test login with: tharab@sena.co.th / 123456
4. Update PROJECT-PROGRESS.md with deployment notes

## Rollback:
If issues found:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```
