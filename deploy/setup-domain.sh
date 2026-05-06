#!/bin/bash
# ============================================================
# Setup itpj.senadigital.com on host Nginx
# รันที่ server: cd /home/admindigital/taskflow && bash deploy/setup-domain.sh
# ============================================================

set -e

DOMAIN="itpj.senadigital.com"
NGINX_CONF="deploy/$DOMAIN"
ENV_FILE="/home/admindigital/taskflow/.env"

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

# 5. Check CORS
echo "5. Checking CORS..."
if grep -q "itpj.senadigital.com" "$ENV_FILE" 2>/dev/null; then
    echo "   ✅ CORS already has domain"
else
    echo "   ⚠️  ต้องเพิ่มใน .env:"
    echo "      CORS_ORIGIN=...,http://itpj.senadigital.com,https://itpj.senadigital.com"
    echo "   แล้วรัน: docker compose -f docker-compose.prod.yml restart taskflow-backend-prod"
fi

# 6. Check VITE_API_URL
echo "6. Checking VITE_API_URL..."
if grep -q "VITE_API_URL.*/taskflow/" "$ENV_FILE" 2>/dev/null; then
    echo "   ❌ VITE_API_URL ยังชี้ /taskflow/api/v1 — ต้องเปลี่ยนเป็น /api/v1"
    echo "      แก้ใน .env แล้ว rebuild frontend:"
    echo "      docker compose -f docker-compose.prod.yml up -d --build"
elif grep -q "VITE_API_URL" "$ENV_FILE" 2>/dev/null; then
    echo "   ✅ VITE_API_URL ไม่มี /taskflow/"
else
    echo "   ⚠️  ไม่เจอ VITE_API_URL ใน .env — ต้องเพิ่ม: VITE_API_URL=/api/v1"
fi

echo ""
echo "✅ Nginx setup done!"
echo "📋 ยังต้องทำ:"
echo "   1. ตั้ง DNS A Record: $DOMAIN → 167.179.239.122"
echo "   2. ตรวจ .env:"
echo "      VITE_API_URL=/api/v1"
echo "      CORS_ORIGIN=...,http://$DOMAIN,https://$DOMAIN"
echo "   3. rebuild frontend + restart backend:"
echo "      docker compose -f docker-compose.prod.yml up -d --build"
echo "   4. ทดสอบ: http://$DOMAIN/login"
echo "   5. HTTPS: sudo certbot --nginx -d $DOMAIN"
echo ""
echo "   ⚠️  VITE_API_URL เป็น build-time variable — แก้แล้วต้อง rebuild frontend ไม่ใช่แค่ restart"
