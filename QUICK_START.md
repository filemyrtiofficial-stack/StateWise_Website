# Quick Start Guide 🚀

## Starting the Application

### 1. Start Backend (Terminal 1)
```bash
cd Backend
npm run dev
```

**Expected output:**
```
✅ Server running on port 5000
✅ Database connected
```

### 2. Start Frontend (Terminal 2)
```bash
cd Frontend
npm run dev
```

**Expected output:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

## Testing Forms

### Hero Section Forms
1. Visit: http://localhost:3000 (or any state page)
2. **Consultation Form** (right side):
   - Fill: Name, Email, Mobile, Address, Pincode
   - Accept terms
   - Click "Submit"
   - ✅ Should show success message

3. **Callback Form** (top left):
   - Enter phone number
   - Click "Get Callback"
   - ✅ Should show success message

### Service Page Form
1. Visit: http://localhost:3000/services/seamless-online-filing
2. Click "File Now" button
3. Fill consultation form
4. Submit
   - ✅ Should show success message with Application ID

## Verify Data in Database

### Check Consultations
```bash
cd Backend
mysql -u [user] -p [database] -e "SELECT * FROM consultations ORDER BY created_at DESC LIMIT 5;"
```

### Check Callback Requests
```bash
mysql -u [user] -p [database] -e "SELECT * FROM callback_requests ORDER BY created_at DESC LIMIT 5;"
```

### Check RTI Applications
```bash
cd Backend
npm run check-db
```

## Troubleshooting

### Backend Not Starting
- Check if port 5000 is available
- Verify database connection: `npm run test-db`
- Check `.env` file exists and has correct values

### Frontend Not Starting
- Check if port 3000 is available
- Verify `VITE_API_BASE_URL` in `.env` or `src/config/api.ts`
- Clear cache: `rm -rf node_modules/.vite`

### Forms Not Submitting
- Check browser console for errors
- Verify backend is running
- Check CORS settings in backend `.env`

## Common Commands

### Backend
```bash
cd Backend
npm run dev          # Start development server
npm run test-db      # Test database connection
npm run check-db     # Check database tables
npm run setup-db     # Setup all tables
npm run add-consultation-tables  # Add consultation tables
npm run test-full    # Full system test
```

### Frontend
```bash
cd Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run test-full    # Test backend connection
```

## API Endpoints

### Public (No Auth Required)
- `POST /api/v1/consultations/public` - Consultation form
- `POST /api/v1/callback-requests/public` - Callback form
- `POST /api/v1/rti-applications/public` - RTI application form
- `GET /api/v1/services` - List services
- `GET /api/v1/states` - List states

### Protected (Auth Required)
- `GET /api/v1/consultations` - List consultations (Admin)
- `GET /api/v1/callback-requests` - List callbacks (Admin)
- `GET /api/v1/rti-applications` - List RTI applications

## Status Check

### Backend Health
```bash
curl http://localhost:5000/health
```

### Frontend-Backend Connection
```bash
cd Frontend
npm run test-full
```

---

**Everything should be working now!** ✅

