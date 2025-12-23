#!/bin/bash
# deploy.sh - MaticTrade Complete VPS Deployment Script
# Domain: matictrade.com | VPS IP: 72.61.213.221
# 
# CARA PAKAI:
# 1. Upload folder matictrade ke VPS: scp -r matictrade root@72.61.213.221:/var/www/
# 2. SSH ke VPS: ssh root@72.61.213.221
# 3. Jalankan: cd /var/www/matictrade && chmod +x deploy.sh && ./deploy.sh

set -e

echo "=============================================="
echo "  MaticTrade VPS Deployment Script"
echo "  IP: 72.61.213.221 | Domain: matictrade.com"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}ERROR: Jalankan dengan sudo!${NC}"
    echo "Usage: sudo ./deploy.sh"
    exit 1
fi

# Get project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo -e "${BLUE}Project directory: $PROJECT_DIR${NC}"
echo ""

#===========================================
# STEP 1: Install System Dependencies
#===========================================
echo -e "${YELLOW}[1/13] Installing system dependencies...${NC}"

apt update -qq
apt install -y curl git nginx postgresql postgresql-contrib redis-server build-essential ufw

# Install Node.js 20
if ! command -v node &> /dev/null || [[ $(node -v | cut -d. -f1 | tr -d 'v') -lt 18 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

echo -e "${GREEN}✓ System dependencies installed${NC}"
echo "  Node.js: $(node -v)"
echo "  NPM: $(npm -v)"
echo "  PM2: $(pm2 -v)"
echo ""

#===========================================
# STEP 2: Configure Firewall
#===========================================
echo -e "${YELLOW}[2/13] Configuring firewall...${NC}"

ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo -e "${GREEN}✓ Firewall configured (SSH, HTTP, HTTPS only)${NC}"
echo ""

#===========================================
# STEP 3: Setup PostgreSQL Database
#===========================================
echo -e "${YELLOW}[3/13] Setting up PostgreSQL database...${NC}"

systemctl start postgresql
systemctl enable postgresql

# Generate random password
DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 20)

sudo -u postgres psql -c "DROP DATABASE IF EXISTS matic_futures;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS matic_user;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE matic_futures;"
sudo -u postgres psql -c "CREATE USER matic_user WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE matic_futures TO matic_user;"
sudo -u postgres psql -d matic_futures -c "GRANT ALL ON SCHEMA public TO matic_user;"

echo -e "${GREEN}✓ PostgreSQL configured${NC}"
echo ""

#===========================================
# STEP 4: Setup Redis
#===========================================
echo -e "${YELLOW}[4/13] Setting up Redis...${NC}"

REDIS_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 20)

# Configure Redis
cat > /etc/redis/redis.conf << EOF
bind 127.0.0.1
port 6379
daemonize yes
pidfile /var/run/redis/redis-server.pid
logfile /var/log/redis/redis-server.log
dir /var/lib/redis
requirepass ${REDIS_PASSWORD}
EOF

systemctl restart redis-server
systemctl enable redis-server

echo -e "${GREEN}✓ Redis configured${NC}"
echo ""

#===========================================
# STEP 5: Generate Secrets & Create Backend .env
#===========================================
echo -e "${YELLOW}[5/13] Creating backend .env...${NC}"

JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
JWT_REFRESH_SECRET=$(openssl rand -base64 64 | tr -d '\n')
ENCRYPTION_KEY=$(openssl rand -hex 16)

cat > "$PROJECT_DIR/backend/.env" << EOF
# Application
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://matic_user:${DB_PASSWORD}@localhost:5432/matic_futures?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# Email SMTP (UPDATE AFTER DEPLOYMENT)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="MaticTrade <noreply@matictrade.com>"

# Frontend URL
FRONTEND_URL=https://matictrade.com
EOF

echo -e "${GREEN}✓ Backend .env created with secure credentials${NC}"
echo ""

#===========================================
# STEP 6: Create Frontend .env
#===========================================
echo -e "${YELLOW}[6/13] Creating frontend .env...${NC}"

cat > "$PROJECT_DIR/frontend/.env" << EOF
NUXT_PUBLIC_API_BASE_URL=https://matictrade.com/api
NUXT_PUBLIC_WS_URL=wss://matictrade.com
NUXT_PUBLIC_BINANCE_WS_URL=wss://fstream.binance.com/ws
NUXT_PUBLIC_OKX_WS_URL=wss://ws.okx.com:8443/ws/v5/public
NUXT_PUBLIC_BITGET_WS_URL=wss://ws.bitget.com/mix/v1/stream
EOF

echo -e "${GREEN}✓ Frontend .env created${NC}"
echo ""

#===========================================
# STEP 7: Install Backend Dependencies & Build
#===========================================
echo -e "${YELLOW}[7/13] Installing & building backend...${NC}"

cd "$PROJECT_DIR/backend"
npm install --production=false
npx prisma generate
npx prisma migrate deploy
npm run build

echo -e "${GREEN}✓ Backend built${NC}"
echo ""

#===========================================
# STEP 8: Install Frontend Dependencies & Build
#===========================================
echo -e "${YELLOW}[8/13] Installing & building frontend...${NC}"

cd "$PROJECT_DIR/frontend"
npm install --production=false
npm run build

echo -e "${GREEN}✓ Frontend built${NC}"
echo ""

#===========================================
# STEP 9: Setup Nginx with SSL Support
#===========================================
echo -e "${YELLOW}[9/13] Setting up Nginx...${NC}"

# Install certbot
apt install -y certbot python3-certbot-nginx

# Create nginx config
cat > /etc/nginx/sites-available/matictrade.com << 'NGINXEOF'
upstream frontend {
    server 127.0.0.1:3000;
}

upstream backend {
    server 127.0.0.1:3001;
}

limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=webhook:10m rate=100r/s;

# Redirect www to non-www
server {
    listen 80;
    server_name www.matictrade.com;
    return 301 https://matictrade.com$request_uri;
}

# Main server block
server {
    listen 80;
    server_name matictrade.com 72.61.213.221;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # API
    location /api {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }

    # Webhook (higher rate limit)
    location /api/webhook {
        limit_req zone=webhook burst=50 nodelay;
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 5s;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # Uploads
    location /uploads {
        proxy_pass http://backend;
        add_header Access-Control-Allow-Origin *;
        add_header Cross-Origin-Resource-Policy cross-origin;
    }

    # Health check
    location /health {
        proxy_pass http://backend;
        access_log off;
    }
}
NGINXEOF

# Enable site
ln -sf /etc/nginx/sites-available/matictrade.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✓ Nginx configured${NC}"
echo ""

#===========================================
# STEP 10: Create Logs Directory
#===========================================
echo -e "${YELLOW}[10/13] Creating logs directory...${NC}"

mkdir -p "$PROJECT_DIR/logs"
mkdir -p "$PROJECT_DIR/backend/logs"
mkdir -p "$PROJECT_DIR/frontend/logs"

echo -e "${GREEN}✓ Logs directory created${NC}"
echo ""

#===========================================
# STEP 11: Start PM2 Services
#===========================================
echo -e "${YELLOW}[11/13] Starting services with PM2...${NC}"

cd "$PROJECT_DIR"

# Stop existing if running
pm2 delete all 2>/dev/null || true

# Start all services
pm2 start ecosystem.config.js

# Wait for services to start
sleep 5

# Save PM2 config and enable startup
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo -e "${GREEN}✓ PM2 services started${NC}"
echo ""

#===========================================
# STEP 12: Seed Database
#===========================================
echo -e "${YELLOW}[12/13] Seeding database...${NC}"

cd "$PROJECT_DIR/backend"
npm run prisma:seed 2>/dev/null || echo "  Seed already applied or skipped"

echo -e "${GREEN}✓ Database seeded${NC}"
echo ""

#===========================================
# STEP 13: Final Health Check
#===========================================
echo -e "${YELLOW}[13/13] Running health checks...${NC}"

sleep 3

# Check if services are running
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health 2>/dev/null || echo "000")
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

if [ "$BACKEND_STATUS" = "200" ]; then
    echo -e "${GREEN}  ✓ Backend: Running (HTTP $BACKEND_STATUS)${NC}"
else
    echo -e "${RED}  ✗ Backend: Not responding (HTTP $BACKEND_STATUS)${NC}"
fi

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}  ✓ Frontend: Running (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}  ✗ Frontend: Not responding (HTTP $FRONTEND_STATUS)${NC}"
fi

echo ""

#===========================================
# DEPLOYMENT COMPLETE
#===========================================
echo ""
echo "=============================================="
echo -e "${GREEN}  DEPLOYMENT COMPLETE! 🚀${NC}"
echo "=============================================="
echo ""

# Show PM2 status
pm2 status

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  ACCESS INFO${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Website (IP): http://72.61.213.221"
echo "  Website (Domain): http://matictrade.com"
echo "  Admin Panel: http://72.61.213.221/admin"
echo "  API Health: http://72.61.213.221/health"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  ADMIN LOGIN${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Email: admin@matictrade.com"
echo "  Password: Vik@11478"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  CREDENTIALS (SAVE THIS!)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Database Password: ${DB_PASSWORD}"
echo "  Redis Password: ${REDIS_PASSWORD}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  SETUP SSL (After DNS is active)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  1. Point DNS matictrade.com → 72.61.213.221"
echo "  2. Run: certbot --nginx -d matictrade.com -d www.matictrade.com"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  USEFUL COMMANDS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  pm2 status            - Check services"
echo "  pm2 logs              - View all logs"
echo "  pm2 logs --lines 100  - View last 100 lines"
echo "  pm2 restart all       - Restart everything"
echo "  pm2 monit             - Monitor dashboard"
echo ""
echo "  nginx -t              - Test nginx config"
echo "  systemctl reload nginx - Reload nginx"
echo ""
echo -e "${GREEN}Website is now LIVE at http://72.61.213.221${NC}"
echo ""
