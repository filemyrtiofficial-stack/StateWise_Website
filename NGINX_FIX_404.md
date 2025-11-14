# Fix 404 Errors - Nginx Configuration Issue

## 🔴 Problem

Frontend sends: `POST /api/v1/consultations/public`
Backend receives: `/v1/consultations/public` (404 Not Found)

**Root Cause:** Nginx `proxy_pass` has a trailing slash, which strips the `/api/` prefix.

## ✅ Solution

### Step 1: Check Current Nginx Config on Server

SSH into your server and check the nginx config:

```bash
sudo cat /etc/nginx/sites-available/rtionlinedelhi.filemyrti.com | grep -A 5 "location /api/"
```

### Step 2: Fix the proxy_pass Directive

**WRONG (strips /api/):**
```nginx
location /api/ {
    proxy_pass http://69.62.79.251:5001/;  # ❌ Trailing slash strips /api/
}
```

**CORRECT (preserves full path):**
```nginx
location /api/ {
    proxy_pass http://69.62.79.251:5001;  # ✅ No trailing slash preserves /api/
}
```

### Step 3: Update Nginx Config on Server

```bash
# Edit the nginx config
sudo nano /etc/nginx/sites-available/rtionlinedelhi.filemyrti.com

# Find this line:
# proxy_pass http://69.62.79.251:5001/;

# Change to (remove trailing slash):
# proxy_pass http://69.62.79.251:5001;

# Save and exit (Ctrl+X, Y, Enter)
```

### Step 4: Test and Reload Nginx

```bash
# Test configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### Step 5: Verify Fix

Test the endpoint:
```bash
curl -X POST https://rtionlinedelhi.filemyrti.com/api/v1/consultations/public \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@test.com","mobile":"9876543210"}'
```

Or check the debug endpoint:
```bash
curl https://rtionlinedelhi.filemyrti.com/api/v1/debug/path
```

You should see:
```json
{
  "success": true,
  "originalUrl": "/api/v1/debug/path",  // ✅ Should include /api/
  "url": "/api/v1/debug/path",
  "path": "/api/v1/debug/path"
}
```

If you see `/v1/debug/path` (without `/api/`), the nginx config still has the trailing slash.

## 📋 Complete Nginx Location Block

Here's the complete correct configuration:

```nginx
# API proxy - forward /api/ requests to backend
# IMPORTANT: No trailing slash on proxy_pass preserves the full path including /api/
location /api/ {
    proxy_pass http://69.62.79.251:5001;  # ✅ NO trailing slash!
    proxy_http_version 1.1;
    
    # Headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # Buffer settings
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    proxy_busy_buffers_size 8k;
    
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

## 🔍 How Nginx proxy_pass Works

| Location | proxy_pass | Request `/api/v1/test` | Backend Receives |
|----------|------------|------------------------|------------------|
| `/api/` | `http://backend;` | `/api/v1/test` | `/api/v1/test` ✅ |
| `/api/` | `http://backend/;` | `/api/v1/test` | `/v1/test` ❌ |

**Rule:** 
- **No trailing slash** = Preserves full path
- **Trailing slash** = Strips location prefix

## ✅ Verification Checklist

- [ ] Nginx config has `proxy_pass http://69.62.79.251:5001;` (no trailing slash)
- [ ] `sudo nginx -t` passes
- [ ] `sudo systemctl reload nginx` completed
- [ ] `curl https://rtionlinedelhi.filemyrti.com/api/v1/debug/path` shows `/api/v1/debug/path`
- [ ] `curl -X POST https://rtionlinedelhi.filemyrti.com/api/v1/consultations/public` returns 200/201 (not 404)

## 🚨 If Still Getting 404

1. **Check backend is running:**
   ```bash
   curl http://69.62.79.251:5001/health
   ```

2. **Check backend logs** to see what path it receives:
   ```bash
   # On backend server
   tail -f /path/to/backend/logs
   ```

3. **Test directly to backend (bypass nginx):**
   ```bash
   curl -X POST http://69.62.79.251:5001/api/v1/consultations/public \
     -H "Content-Type: application/json" \
     -d '{"full_name":"Test","email":"test@test.com","mobile":"9876543210"}'
   ```

4. **Verify route exists in backend:**
   - Check `Backend/routes/index.js` - should have `/api/v1/consultations`
   - Check `Backend/routes/consultationRoutes.js` - should have `router.post('/public', ...)`

