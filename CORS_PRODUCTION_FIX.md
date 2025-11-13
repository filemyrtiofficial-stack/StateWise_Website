# Production CORS Fix - Complete Solution

## Issues Identified and Fixed

### 1. CORS Origin Matching Issues
- **Problem**: Origin normalization wasn't handling all edge cases (ports, trailing slashes, subdomains)
- **Fix**: Created robust `normalizeOrigin()` helper function

### 2. Nginx CORS Header Conflict
- **Problem**: Nginx was adding CORS headers, conflicting with backend CORS middleware
- **Fix**: Removed CORS headers from Nginx, let backend handle all CORS

### 3. Helmet CSP Blocking API Calls
- **Problem**: `connectSrc: ["'self'"]` was blocking cross-origin API calls
- **Fix**: Added production domains to `connectSrc` directive

### 4. Middleware Order
- **Problem**: Helmet was applied before CORS, potentially interfering
- **Fix**: Reordered middlewares - CORS first, then Helmet

### 5. Missing Origin Header Forwarding
- **Problem**: Nginx wasn't forwarding Origin header properly
- **Fix**: Added explicit `proxy_set_header Origin $http_origin`

## Files Modified

### 1. `Backend/middlewares/security.js`

#### Key Changes:
- ✅ Added `normalizeOrigin()` helper function
- ✅ Added `isOriginAllowed()` helper function with subdomain support
- ✅ Enhanced logging for debugging CORS issues
- ✅ Added `maxAge` for preflight caching
- ✅ Fixed Helmet CSP to allow API connections
- ✅ Both `corsOptions` and `consultationCorsOptions` use shared helpers

#### Origin Normalization:
```javascript
// Handles:
// - Trailing slashes: https://delhi.filemyrti.com/ → https://delhi.filemyrti.com
// - Default ports: https://delhi.filemyrti.com:443 → https://delhi.filemyrti.com
// - Case differences: HTTPS://DELHI.FILEMYRTI.COM → https://delhi.filemyrti.com
// - Subdomains: https://www.delhi.filemyrti.com → allowed in production
```

### 2. `Backend/server.js`

#### Key Changes:
- ✅ Verified `trust proxy` is set (already correct)
- ✅ Reordered middlewares: CORS → Helmet → XSS → Sanitize
- ✅ Added comments explaining middleware order importance

#### Middleware Order (Critical):
```javascript
app.use(cors);      // Must be first for preflight handling
app.use(helmet);    // After CORS to avoid interference
app.use(xss);
app.use(sanitize);
```

### 3. `nginx.conf`

#### Key Changes:
- ✅ Removed CORS headers from Nginx (let backend handle it)
- ✅ Added explicit Origin header forwarding
- ✅ Removed OPTIONS handling from Nginx (backend handles it)
- ✅ Added comments explaining why CORS is handled by backend

#### Header Forwarding:
```nginx
proxy_set_header Origin $http_origin;      # Forward origin for CORS
proxy_set_header Referer $http_referer;    # Forward referer
```

## How It Works Now

### Request Flow:
1. **Browser** → Sends POST with `Origin: https://delhi.filemyrti.com`
2. **Nginx** → Forwards request with Origin header to backend
3. **Backend CORS** → Validates origin, sets CORS headers
4. **Backend Route** → Processes request, returns response
5. **Browser** → Receives response with proper CORS headers

### Preflight Flow (OPTIONS):
1. **Browser** → Sends OPTIONS preflight request
2. **Nginx** → Forwards to backend
3. **Backend CORS** → Validates origin, responds with CORS headers
4. **Browser** → Receives 200 OK with CORS headers, proceeds with POST

## Testing

### Test CORS Fix:

```bash
# Test OPTIONS preflight
curl -X OPTIONS https://delhi.filemyrti.com/api/v1/consultations/public \
  -H "Origin: https://delhi.filemyrti.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Expected: 200 OK with CORS headers
# Access-Control-Allow-Origin: https://delhi.filemyrti.com
# Access-Control-Allow-Credentials: true
# Access-Control-Allow-Methods: POST, OPTIONS

# Test POST request
curl -X POST https://delhi.filemyrti.com/api/v1/consultations/public \
  -H "Origin: https://delhi.filemyrti.com" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "mobile": "9876543210",
    "address": "Test Address",
    "pincode": "110001"
  }' \
  -v

# Expected: 200/201 with CORS headers
```

### Test State Route:

```bash
# Test state by slug (case-insensitive)
curl https://delhi.filemyrti.com/api/v1/states/delhi
curl https://delhi.filemyrti.com/api/v1/states/DELHI
curl https://delhi.filemyrti.com/api/v1/states/Delhi

# All should return the same state data
```

## Deployment Steps

### 1. Update Backend Code:
```bash
cd Backend
git pull  # or copy updated files
npm install  # if dependencies changed
```

### 2. Restart Backend:
```bash
pm2 restart filemyrti-backend
pm2 logs filemyrti-backend --lines 100
```

### 3. Update Nginx Config:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/delhi.filemyrti.com
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### 4. Verify Environment:
```bash
cd Backend
cat .env | grep NODE_ENV
# Should show: NODE_ENV=production
```

## Verification Checklist

- [ ] Backend restarted successfully
- [ ] Nginx reloaded without errors
- [ ] NODE_ENV=production in backend .env
- [ ] OPTIONS preflight returns 200 with CORS headers
- [ ] POST to /api/v1/consultations/public succeeds
- [ ] GET to /api/v1/states/delhi returns data
- [ ] No CORS errors in browser console
- [ ] Backend logs show CORS allowing requests

## Troubleshooting

### If CORS still fails:

1. **Check Backend Logs**:
```bash
pm2 logs filemyrti-backend | grep -i cors
```

Look for:
- "CORS: Allowing origin" (success)
- "CORS rejected" (failure with details)

2. **Verify Origin Header**:
```bash
# Check what origin backend receives
curl -X POST http://localhost:5001/api/v1/consultations/public \
  -H "Origin: https://delhi.filemyrti.com" \
  -v
```

3. **Test Direct Backend**:
```bash
# Bypass Nginx, test backend directly
curl -X POST http://69.62.79.251:5001/api/v1/consultations/public \
  -H "Origin: https://delhi.filemyrti.com" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@test.com","mobile":"9876543210","address":"Test","pincode":"110001"}'
```

4. **Check Nginx Headers**:
```bash
# Verify Nginx is forwarding Origin
sudo tail -f /var/log/nginx/access.log | grep api
```

## Key Improvements Summary

### Security:
- ✅ CORS validation centralized in backend
- ✅ Origin normalization prevents bypass attempts
- ✅ Helmet CSP allows necessary connections
- ✅ All security headers intact

### Reliability:
- ✅ Robust origin matching (handles edge cases)
- ✅ Proper preflight handling
- ✅ Better error logging
- ✅ Subdomain support

### Performance:
- ✅ Preflight caching (24 hours)
- ✅ No duplicate CORS headers
- ✅ Efficient origin matching

## Notes

- **Nginx**: No longer adds CORS headers - backend handles all CORS
- **Backend**: Validates and sets CORS headers based on origin
- **Helmet**: CSP updated to allow API connections from production domain
- **Order**: CORS middleware must come before Helmet

## State Route Fix

The state route 404 issue was fixed in previous changes:
- ✅ Case-insensitive slug matching in database
- ✅ Slug normalization in controller
- ✅ Enhanced logging for debugging

All fixes are production-ready and maintain security best practices.

