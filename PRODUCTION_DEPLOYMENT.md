# Production Deployment Guide

This guide provides complete instructions for deploying the StateWise website to production.

## Prerequisites

- Nginx installed and running
- Certbot installed for SSL certificates
- PM2 installed for Node.js process management
- Backend server accessible at `http://69.62.79.251:5001`
- Frontend built and ready in `/var/www/delhi.filemyrti.com/dist`

## 1. Nginx Configuration

### Step 1: Copy Nginx Configuration

```bash
# Backup existing configuration
sudo cp /etc/nginx/sites-available/delhi.filemyrti.com /etc/nginx/sites-available/delhi.filemyrti.com.backup

# Copy new configuration
sudo cp nginx.conf /etc/nginx/sites-available/delhi.filemyrti.com

# Or create symlink if using sites-enabled
sudo ln -sf /etc/nginx/sites-available/delhi.filemyrti.com /etc/nginx/sites-enabled/delhi.filemyrti.com
```

### Step 2: Test Nginx Configuration

```bash
sudo nginx -t
```

### Step 3: Reload Nginx

```bash
sudo systemctl reload nginx
# Or
sudo service nginx reload
```

### Step 4: SSL Certificate Setup (if not already done)

```bash
# Install Certbot if not installed
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d delhi.filemyrti.com -d www.delhi.filemyrti.com

# Auto-renewal is set up automatically, but test it:
sudo certbot renew --dry-run
```

## 2. Backend Configuration

### Step 1: Update Environment Variables

Create or update `.env` file in the Backend directory:

```bash
cd Backend
nano .env
```

Add/update these variables:

```env
NODE_ENV=production
PORT=5001
CORS_ORIGIN=https://delhi.filemyrti.com
CORS_CREDENTIALS=true

# Database
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT (must be at least 32 characters)
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here_min_32_chars

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Step 2: Install Dependencies (if needed)

```bash
cd Backend
npm install --production
```

### Step 3: Restart Backend with PM2

```bash
# Stop existing process (if any)
pm2 stop filemyrti-backend || true
pm2 delete filemyrti-backend || true

# Start backend
cd Backend
pm2 start server.js --name filemyrti-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 4: Verify Backend is Running

```bash
pm2 status
pm2 logs filemyrti-backend --lines 50
```

## 3. Frontend Configuration

### Step 1: Build Frontend for Production

```bash
cd Frontend
npm install
npm run build
```

### Step 2: Deploy Frontend Files

```bash
# Create directory if it doesn't exist
sudo mkdir -p /var/www/delhi.filemyrti.com

# Copy built files
sudo cp -r Frontend/dist/* /var/www/delhi.filemyrti.com/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/delhi.filemyrti.com
sudo chmod -R 755 /var/www/delhi.filemyrti.com
```

### Step 3: Verify Frontend Environment

The frontend automatically detects production mode using Vite's `import.meta.env.MODE` or `import.meta.env.PROD`. No additional configuration needed.

## 4. Testing Commands

### Test Health Endpoint

```bash
# Direct backend test
curl http://69.62.79.251:5001/health

# Through Nginx proxy
curl https://delhi.filemyrti.com/health
```

### Test API Endpoints

```bash
# Test Services API
curl https://delhi.filemyrti.com/api/v1/services

# Test States API
curl https://delhi.filemyrti.com/api/v1/states

# Test RTI Applications (POST)
curl -X POST https://delhi.filemyrti.com/api/v1/rti-applications/public \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": 1,
    "state_id": 1,
    "full_name": "Test User",
    "mobile": "9876543210",
    "email": "test@example.com",
    "rti_query": "Test query",
    "address": "Test Address",
    "pincode": "110001"
  }'

# Test Consultations (POST)
curl -X POST https://delhi.filemyrti.com/api/v1/consultations/public \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "mobile": "9876543210",
    "address": "Test Address",
    "pincode": "110001"
  }'

# Test Callback Requests (POST)
curl -X POST https://delhi.filemyrti.com/api/v1/callback-requests/public \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

### Test CORS

```bash
# Test CORS preflight
curl -X OPTIONS https://delhi.filemyrti.com/api/v1/services \
  -H "Origin: https://delhi.filemyrti.com" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test CORS with actual request
curl https://delhi.filemyrti.com/api/v1/services \
  -H "Origin: https://delhi.filemyrti.com" \
  -v
```

### Test Frontend Routing

```bash
# Test root
curl -I https://delhi.filemyrti.com/

# Test SPA route (should return index.html)
curl -I https://delhi.filemyrti.com/about-us

# Test static assets
curl -I https://delhi.filemyrti.com/assets/index.js
```

### Test SSL and Redirects

```bash
# Test HTTP to HTTPS redirect
curl -I http://delhi.filemyrti.com

# Test www to non-www redirect
curl -I https://www.delhi.filemyrti.com

# Test SSL certificate
openssl s_client -connect delhi.filemyrti.com:443 -servername delhi.filemyrti.com
```

## 5. Verification Checklist

- [ ] Nginx configuration test passes (`nginx -t`)
- [ ] Nginx reloaded successfully
- [ ] SSL certificate is valid and auto-renewal is set up
- [ ] Backend is running on port 5001
- [ ] PM2 process is running and set to start on boot
- [ ] Frontend files are in `/var/www/delhi.filemyrti.com/dist`
- [ ] Health endpoint responds: `curl https://delhi.filemyrti.com/health`
- [ ] API endpoints respond: `curl https://delhi.filemyrti.com/api/v1/services`
- [ ] CORS headers are present in API responses
- [ ] Frontend loads at `https://delhi.filemyrti.com`
- [ ] SPA routing works (try `/about-us` or other routes)
- [ ] HTTP redirects to HTTPS
- [ ] www redirects to non-www

## 6. Troubleshooting

### Backend Not Responding

```bash
# Check PM2 status
pm2 status
pm2 logs filemyrti-backend

# Check if port is in use
sudo netstat -tulpn | grep 5001

# Restart backend
pm2 restart filemyrti-backend
```

### Nginx Errors

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Test configuration
sudo nginx -t
```

### CORS Issues

1. Verify backend CORS configuration in `Backend/middlewares/security.js`
2. Check that `CORS_ORIGIN` environment variable is set correctly
3. Verify Nginx is not stripping CORS headers
4. Check browser console for CORS errors

### 404 Errors on Frontend Routes

1. Verify `try_files $uri $uri/ /index.html;` is in Nginx config
2. Check that frontend files are in the correct directory
3. Verify Nginx root directive points to the dist folder

### API 404 Errors

1. Verify backend is running on port 5001
2. Check Nginx proxy_pass is correct: `http://69.62.79.251:5001`
3. Verify backend routes are prefixed with `/api/v1`
4. Check Nginx error logs for proxy errors

## 7. Maintenance Commands

### Update Backend

```bash
cd Backend
git pull
npm install --production
pm2 restart filemyrti-backend
```

### Update Frontend

```bash
cd Frontend
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/delhi.filemyrti.com/
sudo chown -R www-data:www-data /var/www/delhi.filemyrti.com
```

### View Logs

```bash
# Backend logs
pm2 logs filemyrti-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 8. Security Notes

- SSL certificates auto-renew via Certbot
- Security headers are configured in Nginx
- Rate limiting is configured in backend
- CORS is restricted to production domain
- All API routes require `/api/v1` prefix
- Backend runs behind Nginx reverse proxy

## Support

For issues, check:
1. PM2 logs: `pm2 logs filemyrti-backend`
2. Nginx logs: `/var/log/nginx/error.log`
3. Backend logs: Check PM2 output
4. System logs: `journalctl -u nginx`

