# API Testing Commands

Quick reference for testing API endpoints in production.

## Prerequisites

All commands assume the production URL: `https://delhi.filemyrti.com`

## Health Check

```bash
# Direct backend (if accessible)
curl http://69.62.79.251:5001/health

# Through Nginx
curl https://delhi.filemyrti.com/health

# With verbose output
curl -v https://delhi.filemyrti.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Services API

```bash
# Get all services
curl https://delhi.filemyrti.com/api/v1/services

# Get service by slug
curl https://delhi.filemyrti.com/api/v1/services/rti-application
```

## States API

```bash
# Get all states
curl https://delhi.filemyrti.com/api/v1/states

# Get state by slug
curl https://delhi.filemyrti.com/api/v1/states/delhi
```

## RTI Applications API

```bash
# Create public RTI application
curl -X POST https://delhi.filemyrti.com/api/v1/rti-applications/public \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": 1,
    "state_id": 1,
    "full_name": "Test User",
    "mobile": "9876543210",
    "email": "test@example.com",
    "rti_query": "Test RTI query",
    "address": "123 Test Street, Test City",
    "pincode": "110001"
  }'

# Get my applications (requires authentication)
curl -X GET https://delhi.filemyrti.com/api/v1/rti-applications/my-applications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Consultations API

```bash
# Create public consultation
curl -X POST https://delhi.filemyrti.com/api/v1/consultations/public \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "mobile": "9876543210",
    "address": "123 Test Street",
    "pincode": "110001",
    "state_slug": "delhi"
  }'
```

## Callback Requests API

```bash
# Create callback request
curl -X POST https://delhi.filemyrti.com/api/v1/callback-requests/public \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "state_slug": "delhi"
  }'
```

## Payments API

```bash
# Create payment order
curl -X POST https://delhi.filemyrti.com/api/v1/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 1000,
    "currency": "INR",
    "receipt": "receipt_123"
  }'

# Verify payment
curl -X POST https://delhi.filemyrti.com/api/v1/payments/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "razorpay_payment_id": "pay_xxx",
    "razorpay_order_id": "order_xxx",
    "razorpay_signature": "signature_xxx",
    "order_id": "order_xxx"
  }'
```

## Authentication API

```bash
# Register user
curl -X POST https://delhi.filemyrti.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "phone": "9876543210"
  }'

# Login
curl -X POST https://delhi.filemyrti.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'

# Get profile (requires authentication)
curl -X GET https://delhi.filemyrti.com/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## CORS Testing

```bash
# Test CORS preflight (OPTIONS request)
curl -X OPTIONS https://delhi.filemyrti.com/api/v1/services \
  -H "Origin: https://delhi.filemyrti.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Test CORS with actual request
curl https://delhi.filemyrti.com/api/v1/services \
  -H "Origin: https://delhi.filemyrti.com" \
  -v
```

Expected CORS headers in response:
```
Access-Control-Allow-Origin: https://delhi.filemyrti.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

## Error Testing

```bash
# Test 404 error
curl -v https://delhi.filemyrti.com/api/v1/nonexistent

# Test 400 error (invalid data)
curl -X POST https://delhi.filemyrti.com/api/v1/rti-applications/public \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# Test 401 error (unauthorized)
curl -X GET https://delhi.filemyrti.com/api/v1/auth/profile
```

## SSL Testing

```bash
# Test SSL certificate
openssl s_client -connect delhi.filemyrti.com:443 -servername delhi.filemyrti.com

# Test SSL redirect
curl -I http://delhi.filemyrti.com

# Test www redirect
curl -I https://www.delhi.filemyrti.com
```

## Frontend Testing

```bash
# Test root page
curl -I https://delhi.filemyrti.com/

# Test SPA routing (should return index.html)
curl -I https://delhi.filemyrti.com/about-us

# Test static assets
curl -I https://delhi.filemyrti.com/assets/index.js
curl -I https://delhi.filemyrti.com/assets/index.css
```

## Rate Limiting Test

```bash
# Make multiple rapid requests to test rate limiting
for i in {1..110}; do
  curl -s https://delhi.filemyrti.com/api/v1/services > /dev/null
  echo "Request $i"
done
```

After 100 requests, you should receive a 429 Too Many Requests response.

## Complete Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="https://delhi.filemyrti.com"

echo "Testing Health Endpoint..."
curl -s "$BASE_URL/health" | jq .

echo -e "\nTesting Services API..."
curl -s "$BASE_URL/api/v1/services" | jq '.success, .data | length'

echo -e "\nTesting States API..."
curl -s "$BASE_URL/api/v1/states" | jq '.success, .data | length'

echo -e "\nTesting CORS..."
curl -s -X OPTIONS "$BASE_URL/api/v1/services" \
  -H "Origin: $BASE_URL" \
  -H "Access-Control-Request-Method: GET" \
  -v 2>&1 | grep -i "access-control"

echo -e "\nAll tests completed!"
```

Make it executable:
```bash
chmod +x test-api.sh
./test-api.sh
```

## Using jq for Pretty JSON

Install jq for formatted JSON output:
```bash
sudo apt-get install jq
```

Then use:
```bash
curl -s https://delhi.filemyrti.com/api/v1/services | jq .
```

