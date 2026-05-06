# IT Project System — itpj.senadigital.com
# Proxy to taskflow containers (frontend:4200, backend:4201)
# วางไฟล์: sudo cp deploy/itpj.senadigital.com /etc/nginx/sites-available/
# Enable:  sudo ln -s /etc/nginx/sites-available/itpj.senadigital.com /etc/nginx/sites-enabled/

server {
    listen 80;
    server_name itpj.senadigital.com;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Everything → proxy to frontend container
    # Container Nginx handles: SPA routing, /api/ proxy, /uploads/ proxy, /taskflow/* redirects
    location / {
        proxy_pass http://127.0.0.1:4200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 25M;
    }
}
