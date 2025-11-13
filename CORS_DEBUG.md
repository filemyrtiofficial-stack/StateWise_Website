# CORS Debugging Guide

## Issue: 403 Forbidden - CORS Error

If you're getting CORS errors, follow these steps:

## 1. Verify NODE_ENV is Set

```bash
# Check if NODE_ENV is set to production
cd Backend
echo $NODE_ENV

# If not set, add to .env file:
# NODE_ENV=production
```

## 2. Check Backend Logs

After restarting, check the logs for CORS warnings:

```bash
pm2 logs filemyrti-backend --lines 100 | grep -i cors
```

You should see logs showing:
- What origin was received
- What origins are allowed
- Whether the origin matched

## 3. Test CORS Directly

```bash
# Test from command line
curl -X OPTIONS https://delhi.filemyrti.com/api/v1/consultations/public \
  -H "Origin: https://delhi.filemyrti.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

Expected response should include:
```
< Access-Control-Allow-Origin: https://delhi.filemyrti.com
< Access-Control-Allow-Credentials: true
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

## 4. Check Browser Console

In browser console, check the Network tab:
1. Find the failed request
2. Check the Request Headers - look for `Origin: https://delhi.filemyrti.com`
3. Check the Response Headers - look for CORS headers

## 5. Verify Environment Variables

```bash
cd Backend
cat .env | grep -E "(NODE_ENV|CORS_ORIGIN)"
```

Should show:
```
NODE_ENV=production
CORS_ORIGIN=https://delhi.filemyrti.com
```

## 6. Restart Backend

After making changes:

```bash
pm2 restart filemyrti-backend
pm2 logs filemyrti-backend --lines 50
```

## 7. Test with Updated Code

The updated CORS middleware now:
- ✅ Normalizes origins (handles trailing slashes, case differences)
- ✅ Allows both www and non-www versions
- ✅ Has a fallback check for production domain
- ✅ Logs detailed information for debugging

## Common Issues

### Issue: NODE_ENV not set to 'production'
**Solution**: Add `NODE_ENV=production` to Backend/.env file

### Issue: Origin header missing or different
**Solution**: The updated code now handles this with a fallback check

### Issue: Nginx stripping/modifying headers
**Solution**: Verify Nginx config preserves Origin header (should be automatic)

## Quick Fix

If you need to temporarily allow all origins for testing (NOT RECOMMENDED FOR PRODUCTION):

In `Backend/middlewares/security.js`, temporarily change:
```javascript
if (isAllowed || isProductionDomain || allowedOrigins.length === 0) {
  callback(null, true);
} else {
  // Temporarily allow all in production for debugging
  if (config.NODE_ENV === 'production') {
    callback(null, true);
  } else {
    callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
  }
}
```

**Remember to revert this after debugging!**

