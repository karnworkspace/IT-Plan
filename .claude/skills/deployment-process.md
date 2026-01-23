# Skill: Deployment Process

## Purpose
Deploy application อย่างปลอดภัยและมีขั้นตอนชัดเจน

## When to Use
- Deploy new release
- Hotfix production
- Rollback deployment

## Prerequisites
- Code reviewed และ approved
- Tests passed
- Environment variables configured
- Database migrations ready

## Pre-Deployment Checklist
- [ ] All tests pass locally
- [ ] Build succeeds
- [ ] PR merged to main
- [ ] Database migrations prepared
- [ ] Environment variables verified

## Step-by-Step

### Step 1: Prepare
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci

# Build
npm run build

# Test
npm test
```

### Step 2: Run Migrations (if any)
```bash
# Check pending migrations
npx prisma migrate status

# Apply migrations (BACKUP FIRST!)
npx prisma migrate deploy
```

### Step 3: Deploy
```bash
# Tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push --tags

# Deploy command (varies by platform)
# Vercel
vercel --prod

# Docker
docker build -t app:latest .
docker push app:latest

# DigitalOcean/AWS
ssh server 'cd /app && git pull && npm ci && npm run build && pm2 restart all'
```

### Step 4: Verify
```bash
# Check health endpoint
curl https://your-app.com/api/health

# Check logs
pm2 logs
# or
docker logs container_name
```

### Step 5: Monitor
- ดู error rates
- ดู response times
- ดู server metrics

## Rollback Plan
```bash
# Revert to previous version
git checkout v0.9.0
npm ci && npm run build

# Rollback migrations (if needed)
npx prisma migrate resolve --rolled-back migration_name

# Redeploy
pm2 restart all
```

## Post-Deployment
- [ ] Smoke test ผ่าน
- [ ] Monitor 30 นาที
- [ ] แจ้งทีม
- [ ] Update deployment log

## Environment Checklist
| Variable | Staging | Production |
|----------|---------|------------|
| DATABASE_URL | | |
| API_KEY | | |
| NODE_ENV | staging | production |

## Best Practices
1. Deploy ช่วงที่ traffic ต่ำ
2. Backup database ก่อน migrate
3. ใช้ feature flags สำหรับ risky changes
4. Monitor อย่างน้อย 30 นาที
5. มี rollback plan เสมอ

## Common Pitfalls
- Deploy ไม่ตรงกับ migration
- ลืม set environment variables
- ไม่ backup ก่อน migrate
- ไม่มี rollback plan
