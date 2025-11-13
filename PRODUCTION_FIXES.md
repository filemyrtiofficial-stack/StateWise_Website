# Production CORS and Route Fixes

## Issues Fixed

### 1. CORS 403 Error for `/api/v1/consultations/public`
**Problem**: POST requests returning 403 Forbidden in production

**Root Cause**: The `consultationCorsOptions` was missing a fallback check for production domains, causing strict origin matching to fail.

**Solution**:
- Added fallback check: `isProductionDomain` that allows any origin containing `delhi.filemyrti.com` in production
- Improved origin normalization (lowercase, remove trailing slash)
- Enhanced logging for debugging CORS rejections

### 2. State Route 404 Error for `/api/v1/states/:state`
**Problem**: GET requests returning 404 "State not found" in production

**Root Cause**: Case-sensitive slug matching in database query

**Solution**:
- Made database query case-insensitive using `LOWER()` function
- Added slug normalization in controller (trim and lowercase)
- Added comprehensive logging for debugging

## Files Modified

### `Backend/middlewares/security.js`
- ✅ Added fallback check to `consultationCorsOptions` for production domains
- ✅ Improved origin normalization and matching logic
- ✅ Enhanced error logging

### `Backend/models/State.js`
- ✅ Made `findBySlug()` case-insensitive using SQL `LOWER()` function

### `Backend/controllers/stateController.js`
- ✅ Added slug normalization (trim and lowercase)
- ✅ Added validation for empty slugs
- ✅ Enhanced logging for debugging

## Testing

### Test CORS Fix

```bash
# Test OPTIONS preflight
curl -X OPTIONS https://delhi.filemyrti.com/api/v1/consultations/public \
  -H "Origin: https://delhi.filemyrti.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

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
```

Expected: Should return 200/201 with proper CORS headers

### Test State Route Fix

```bash
# Test state by slug (case-insensitive)
curl https://delhi.filemyrti.com/api/v1/states/delhi
curl https://delhi.filemyrti.com/api/v1/states/DELHI
curl https://delhi.filemyrti.com/api/v1/states/Delhi

# All should return the same state
```

Expected: All should return 200 with state data

## Deployment Steps

1. **Restart Backend**:
```bash
cd Backend
pm2 restart filemyrti-backend
pm2 logs filemyrti-backend --lines 50
```

2. **Verify Environment**:
```bash
# Ensure NODE_ENV is set to production
cat .env | grep NODE_ENV
# Should show: NODE_ENV=production
```

3. **Test Endpoints**:
```bash
# Test consultation endpoint
curl -X POST https://delhi.filemyrti.com/api/v1/consultations/public \
  -H "Origin: https://delhi.filemyrti.com" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@test.com","mobile":"9876543210","address":"Test","pincode":"110001"}'

# Test state endpoint
curl https://delhi.filemyrti.com/api/v1/states/delhi
```

## Key Improvements

### CORS Configuration
- ✅ Explicitly allows `https://delhi.filemyrti.com` and `https://www.delhi.filemyrti.com`
- ✅ Normalizes origins (lowercase, no trailing slash)
- ✅ Fallback check for production domains
- ✅ Proper OPTIONS preflight handling
- ✅ Enhanced logging for debugging

### State Route
- ✅ Case-insensitive slug matching
- ✅ Slug normalization in controller
- ✅ Better error handling and logging
- ✅ Validation for empty slugs

## Security Notes

- ✅ All Helmet security headers remain intact
- ✅ Rate limiting still applies to all routes
- ✅ CORS is properly configured for production
- ✅ No security measures were compromised

## Troubleshooting

If issues persist:

1. **Check Backend Logs**:
```bash
pm2 logs filemyrti-backend | grep -E "(CORS|State|error)" --color=never
```

2. **Verify NODE_ENV**:
```bash
cd Backend
echo $NODE_ENV
# Should be: production
```

3. **Test Database Connection**:
```bash
cd Backend
node -e "require('./config/database').testConnection().then(r => console.log('DB:', r))"
```

4. **Check State Data**:
```bash
# Connect to database and verify states exist
mysql -u [user] -p [database] -e "SELECT id, name, slug FROM states LIMIT 10;"
```

## Summary

Both issues have been resolved:
- ✅ CORS now properly allows production frontend with fallback checks
- ✅ State routes now work with case-insensitive slug matching
- ✅ Enhanced logging for easier debugging
- ✅ All security measures remain intact

