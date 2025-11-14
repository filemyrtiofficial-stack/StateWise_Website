# 🔴 CRITICAL FIX: Nginx proxy_pass Trailing Slash

## ❌ Your Current Config (WRONG)

```nginx
location /api/ {
    proxy_pass http://localhost:5001/;  # ❌ TRAILING SLASH STRIPS /api/
    ...
}
```

**Result:** `/api/v1/callback-requests/public` → Backend receives `/v1/callback-requests/public` (404)

---

## ✅ Correct Config

```nginx
location /api/ {
    proxy_pass http://localhost:5001;  # ✅ NO trailing slash - preserves /api/
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # CORS headers
    add_header Access-Control-Allow-Origin $http_origin always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Request-ID" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Request-ID" always;
        add_header Access-Control-Allow-Credentials "true" always;
        add_header Access-Control-Max-Age 1728000;
        add_header Content-Type 'text/plain charset=UTF-8';
        add_header Content-Length 0;
        return 204;
    }
}
```

**Result:** `/api/v1/callback-requests/public` → Backend receives `/api/v1/callback-requests/public` ✅

---

## 🚀 Quick Fix on Server

```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/rtionlinedelhi.filemyrti.com

# Find this line:
proxy_pass http://localhost:5001/;

# Change to (remove trailing slash):
proxy_pass http://localhost:5001;

# Save (Ctrl+X, Y, Enter)

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## 📋 Complete Corrected Config

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name rtionlinedelhi.filemyrti.com www.rtionlinedelhi.filemyrti.com;

    root /var/www/StateWise_Website/Frontend/dist;
    index index.html;

    # SSL
    ssl_certificate /etc/letsencrypt/live/rtionlinedelhi.filemyrti.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rtionlinedelhi.filemyrti.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ✅ FIXED: API proxy - NO trailing slash preserves /api/ prefix
    location /api/ {
        proxy_pass http://localhost:5001;  # ✅ NO trailing slash!
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # CORS headers
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Request-ID" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Handle preflight OPTIONS requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin $http_origin always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Request-ID" always;
            add_header Access-Control-Allow-Credentials "true" always;
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔍 How to Verify Fix

After updating and reloading nginx:

```bash
# Test the endpoint
curl -X POST https://rtionlinedelhi.filemyrti.com/api/v1/callback-requests/public \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","state_slug":"delhi"}'

# Should return 200/201, not 404
```

Or check the debug endpoint:
```bash
curl https://rtionlinedelhi.filemyrti.com/api/v1/debug/path
```

Should show:
```json
{
  "originalUrl": "/api/v1/debug/path",  // ✅ Includes /api/
  "url": "/api/v1/debug/path"
}
```

If you see `/v1/debug/path` (without `/api/`), the trailing slash is still there.

---

## ⚠️ Key Point

**Nginx proxy_pass behavior:**
- `proxy_pass http://backend/;` (with `/`) = Strips location prefix → `/api/v1/...` becomes `/v1/...` ❌
- `proxy_pass http://backend;` (no `/`) = Preserves full path → `/api/v1/...` stays `/api/v1/...` ✅

