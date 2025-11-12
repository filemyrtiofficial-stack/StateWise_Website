# Hero Section Backend Connection ✅

## Overview

The hero section forms (consultation form and callback form) are now fully connected to the backend and saving data to the database.

## What Was Created

### Backend Components

#### 1. **Database Tables**
- ✅ `consultations` - Stores consultation form submissions
- ✅ `callback_requests` - Stores callback form submissions

#### 2. **Models**
- ✅ `Backend/models/Consultation.js` - Consultation database operations
- ✅ `Backend/models/CallbackRequest.js` - Callback request database operations

#### 3. **Controllers**
- ✅ `Backend/controllers/consultationController.js` - Consultation form logic
- ✅ `Backend/controllers/callbackController.js` - Callback form logic

#### 4. **Routes**
- ✅ `Backend/routes/consultationRoutes.js` - Consultation API routes
- ✅ `Backend/routes/callbackRoutes.js` - Callback API routes

### Frontend Updates

#### 1. **API Configuration**
- ✅ Added consultation endpoints to `Frontend/src/config/api.ts`
- ✅ Added callback request endpoints to `Frontend/src/config/api.ts`

#### 2. **API Services**
- ✅ `consultationsAPI` in `Frontend/src/services/api.ts`
- ✅ `callbackRequestsAPI` in `Frontend/src/services/api.ts`

#### 3. **Component Updates**
- ✅ `Frontend/src/components/state/StateHero.tsx` - Forms now submit to backend

## API Endpoints

### Consultation Form (Public)
```
POST /api/v1/consultations/public
Body: {
  full_name: string,
  email: string,
  mobile: string,
  address: string,
  pincode: string,
  state_slug?: string,
  source?: string
}
```

### Callback Form (Public)
```
POST /api/v1/callback-requests/public
Body: {
  phone: string,
  state_slug?: string
}
```

### Admin Endpoints (Protected)
- `GET /api/v1/consultations` - List all consultations
- `GET /api/v1/consultations/:id` - Get consultation by ID
- `PATCH /api/v1/consultations/:id/status` - Update consultation status
- `GET /api/v1/callback-requests` - List all callback requests
- `GET /api/v1/callback-requests/:id` - Get callback request by ID
- `PATCH /api/v1/callback-requests/:id/status` - Update callback request status

## Database Schema

### consultations Table
```sql
- id (INT, PRIMARY KEY)
- full_name (VARCHAR(100))
- email (VARCHAR(100))
- mobile (VARCHAR(20))
- address (TEXT)
- pincode (VARCHAR(10))
- state_slug (VARCHAR(100))
- source (VARCHAR(50), DEFAULT 'hero_section')
- status (ENUM: 'pending', 'contacted', 'completed', 'cancelled')
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### callback_requests Table
```sql
- id (INT, PRIMARY KEY)
- phone (VARCHAR(20))
- state_slug (VARCHAR(100))
- status (ENUM: 'pending', 'called', 'completed', 'cancelled')
- called_at (TIMESTAMP)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## How It Works

### Consultation Form Flow
1. User fills consultation form in hero section
2. Form submits to `POST /api/v1/consultations/public`
3. Backend validates data
4. Data saved to `consultations` table
5. Success message shown to user

### Callback Form Flow
1. User enters phone number in callback form
2. Form submits to `POST /api/v1/callback-requests/public`
3. Backend validates phone number
4. Data saved to `callback_requests` table
5. Success message shown to user

## Testing

### Test Consultation Form
1. Start backend: `cd Backend && npm run dev`
2. Start frontend: `cd Frontend && npm run dev`
3. Visit any state page (e.g., `/` or `/states/telangana`)
4. Fill consultation form in hero section
5. Submit form
6. Check database:
   ```bash
   cd Backend
   mysql -u [user] -p [database] -e "SELECT * FROM consultations ORDER BY created_at DESC LIMIT 5;"
   ```

### Test Callback Form
1. Enter phone number in callback form
2. Click "Get Callback"
3. Check database:
   ```bash
   mysql -u [user] -p [database] -e "SELECT * FROM callback_requests ORDER BY created_at DESC LIMIT 5;"
   ```

## Setup Commands

### Create Tables
```bash
cd Backend
npm run add-consultation-tables
```

### Verify Tables
```bash
cd Backend
npm run check-db
```

## Status Management

### Consultation Status
- `pending` - New consultation (default)
- `contacted` - Team has contacted the user
- `completed` - Consultation completed
- `cancelled` - Consultation cancelled

### Callback Status
- `pending` - New callback request (default)
- `called` - Team has called the user
- `completed` - Callback completed
- `cancelled` - Callback cancelled

## Admin Features

Admins can:
- View all consultations and callback requests
- Filter by status or state
- Update status and add notes
- Track when callbacks were made

## Error Handling

- ✅ Form validation (required fields, email format, phone format)
- ✅ Error messages shown to users
- ✅ Console logging for debugging
- ✅ Graceful error handling

## Security

- ✅ Public endpoints (no authentication required for submissions)
- ✅ Admin endpoints protected with JWT authentication
- ✅ Input validation and sanitization
- ✅ SQL injection protection (parameterized queries)

## Status

✅ **Hero section forms fully connected to backend**
✅ **Data saving to database**
✅ **Both forms working**
✅ **Error handling in place**
✅ **Admin endpoints ready**

---

**Connection Complete!** 🎉

