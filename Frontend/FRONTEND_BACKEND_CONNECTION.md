# Frontend-Backend Connection Guide

## Overview

This guide explains how the frontend connects to the backend API and how to test the connection.

## Configuration

### Environment Variables

Create a `.env` file in the `Frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

**Default:** If not set, the frontend defaults to `http://localhost:5000/api/v1`

### API Configuration

The API configuration is centralized in:
- `Frontend/src/config/api.ts` - API endpoints and configuration
- `Frontend/src/services/api.ts` - API service functions

## Connection Test

### Method 1: Using the Connection Test Component

Add the `ConnectionTest` component to any page to test the connection:

```tsx
import { ConnectionTest } from '../components/common/ConnectionTest';

// In your component
<ConnectionTest />
```

### Method 2: Test in Browser Console

Open browser console and run:

```javascript
// Test health endpoint
fetch('http://localhost:5000/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(err => console.error('❌ Backend connection failed:', err));
```

### Method 3: Use the Test Utility

```typescript
import { testBackendConnection } from './utils/apiTest';

testBackendConnection().then(result => {
  console.log(result);
});
```

## API Endpoints

### Base URL
- Development: `http://localhost:5000/api/v1`
- Production: Set via `VITE_API_BASE_URL` environment variable

### Available Endpoints

**Authentication:**
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (Protected)

**Services:**
- `GET /api/v1/services` - Get all services
- `GET /api/v1/services/:slug` - Get service by slug

**States:**
- `GET /api/v1/states` - Get all states
- `GET /api/v1/states/:slug` - Get state by slug

**RTI Applications:**
- `POST /api/v1/rti-applications` - Create RTI application (Protected)
- `GET /api/v1/rti-applications/my-applications` - Get user's applications (Protected)

**Health Check:**
- `GET /health` - Server health check

## Integration Status

### ✅ Implemented
- API configuration (`config/api.ts`)
- API service functions (`services/api.ts`)
- Connection test utilities
- Health check endpoint

### 🔄 In Progress
- RTI application form submission (partially integrated)
- Authentication flow
- Service data fetching from backend

### 📝 TODO
- Complete RTI application form integration
- Add authentication state management
- Fetch services and states from backend instead of static data
- Add error handling and retry logic
- Add loading states

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Check backend CORS configuration in `Backend/middlewares/security.js`
2. Verify `CORS_ORIGIN` in backend `.env` matches frontend URL
3. Default: `CORS_ORIGIN=http://localhost:3000`

### Connection Refused

If connection is refused:
1. Make sure backend server is running: `cd Backend && npm run dev`
2. Check backend is on port 5000
3. Verify `VITE_API_BASE_URL` in frontend `.env`

### 404 Not Found

If endpoints return 404:
1. Check backend routes are properly configured
2. Verify API version in URL (`/api/v1`)
3. Check backend server logs

## Testing the Connection

1. **Start Backend:**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Test Connection:**
   - Open browser console
   - Run the test script above
   - Or use the ConnectionTest component

## Next Steps

1. Complete RTI application form integration
2. Add authentication state management (Context/Redux)
3. Replace static data with API calls
4. Add proper error handling
5. Implement retry logic for failed requests

