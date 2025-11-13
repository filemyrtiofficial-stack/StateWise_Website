# CORS Fix Summary

## Problem
- CORS error: "Not allowed by CORS. Origin: https://delhi.filemyrti.com"
- POST requests to `/api/v1/consultations/public` were being rejected

## Solution Implemented

### 1. Route-Specific CORS Middleware
Created a dedicated CORS configuration (`consultationCors`) specifically for the `/api/v1/consultations/public` route that:
- ✅ Explicitly allows `https://delhi.filemyrti.com`
- ✅ Handles OPTIONS preflight requests
- ✅ Allows POST requests with proper headers
- ✅ Supports credentials

### 2. Updated Files

#### `Backend/middlewares/security.js`
- Added `consultationCorsOptions` - dedicated CORS config for consultation route
- Exported `consultationCors` middleware
- Improved global CORS with better logging

#### `Backend/routes/consultationRoutes.js`
- Added route-specific CORS middleware
- Handles OPTIONS preflight: `router.options('/public', consultationCors)`
- Handles POST: `router.post('/public', consultationCors, createConsultation)`

## How It Works

1. **OPTIONS Preflight**: Browser sends OPTIONS request → handled by `router.options('/public', consultationCors)`
2. **POST Request**: Browser sends POST request → handled by `router.post('/public', consultationCors, createConsultation)`
3. **CORS Headers**: Middleware adds proper CORS headers to both responses

## Testing

### Test OPTIONS Preflight
```bash
curl -X OPTIONS https://delhi.filemyrti.com/api/v1/consultations/public \
  -H "Origin: https://delhi.filemyrti.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

Expected response headers:
```
Access-Control-Allow-Origin: https://delhi.filemyrti.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Request-ID
```

### Test POST Request
```bash
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
```

## Deployment Steps

1. **Restart Backend**:
```bash
cd Backend
pm2 restart filemyrti-backend
pm2 logs filemyrti-backend --lines 50
```

2. **Verify NODE_ENV**:
```bash
# In Backend/.env file, ensure:
NODE_ENV=production
```

3. **Test from Frontend**:
- Open browser console
- Submit consultation form
- Check Network tab for successful POST request
- Verify no CORS errors

## Security Notes

- ✅ Helmet security headers remain intact (applied globally)
- ✅ CORS is route-specific for consultations/public
- ✅ Other routes use global CORS configuration
- ✅ Credentials are allowed for authenticated requests
- ✅ Production domain is explicitly whitelisted

## Troubleshooting

If CORS errors persist:

1. **Check Backend Logs**:
```bash
pm2 logs filemyrti-backend | grep -i cors
```

2. **Verify Origin Header**:
- Check browser Network tab
- Origin should be exactly: `https://delhi.filemyrti.com`

3. **Check NODE_ENV**:
```bash
cd Backend
cat .env | grep NODE_ENV
# Should show: NODE_ENV=production
```

4. **Test Directly**:
```bash
# Test from server
curl -X POST http://localhost:5001/api/v1/consultations/public \
  -H "Origin: https://delhi.filemyrti.com" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@test.com","mobile":"9876543210","address":"Test","pincode":"110001"}'
```

## Code Changes Summary

### security.js
- Added `consultationCorsOptions` configuration
- Exported `consultationCors` middleware
- Improved global CORS with better error logging

### consultationRoutes.js
- Imported `consultationCors` middleware
- Added OPTIONS handler for preflight
- Applied CORS to POST route

The fix ensures that:
- ✅ Preflight OPTIONS requests are handled
- ✅ POST requests from `https://delhi.filemyrti.com` are allowed
- ✅ All CORS headers are properly set
- ✅ Security headers from Helmet remain intact

