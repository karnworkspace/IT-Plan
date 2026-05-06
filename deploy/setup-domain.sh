#!/bin/bash
# ============================================================
# Setup itproject.senadigital.com on host Nginx
# รันที่ server: cd /home/admindigital/taskflow && bash deploy/setup-domain.sh
# ============================================================

set -e

DOMAIN="itproject.senadigital.com"
NGINX_CONF="deploy/$DOMAIN"

echo "🔧 Setting up $DOMAIN..."

# 1. Copy nginx config
echo "1. Copying nginx config..."
sudo cp "$NGINX_CONF" "/etc/nginx/sites-available/$DOMAIN"

# 2. Enable site (skip if already linked)
if [ ! -L "/etc/nginx/sites-enabled/$DOMAIN" ]; then
    echo "2. Enabling site..."
    sudo ln -s "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
else
    echo "2. Site already enabled"
fi

# 3. Test nginx
echo "3. Testing nginx config..."
sudo nginx -t

# 4. Reload nginx
echo "4. Reloading nginx..."
sudo systemctl reload nginx

# 5. Update CORS
echo "5. Updating CORS..."
ENV_FILE="/home/admindigital/taskflow/.env"
if grep -q "itproject.senadigital.com" "$ENV_FILE" 2>/dev/null; then
    echo "   CORS already has domain"
else
    echo "   ⚠️  ต้องเพิ่ม http://itproject.senadigital.com ใน CORS_ORIGIN ใน .env"
    echo "   แล้วรัน: docker compose -f docker-compose.prod.yml restart taskflow-backend-prod"
fi

echo ""
echo "✅ Nginx setup done!"
echo "📋 ยังต้องทำ:"
echo "   1. ตั้ง DNS A Record: $DOMAIN → 167.179.239.122"
echo "   2. เพิ่ม CORS ใน .env (ถ้ายังไม่มี)"
echo "   3. restart backend"
echo "   4. ทดสอบ: http://$DOMAIN/taskflow/login"
echo "   5. HTTPS: sudo certbot --nginx -d $DOMAIN"
