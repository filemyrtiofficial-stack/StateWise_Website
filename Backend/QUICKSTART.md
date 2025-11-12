# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd Backend
npm install
```

### Step 2: Configure Environment
Create a `.env` file in the Backend folder:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=u665497677_StatesubDomain
DB_PASSWORD=fileMyRTI@50cr
DB_NAME=u665497677_State

JWT_SECRET=yourSecretKeyChangeThisInProduction
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Setup Database
Run the SQL script to create tables:

```bash
# Using MySQL command line
mysql -u u665497677_StatesubDomain -p u665497677_State < database/setup.sql

# Or import via phpMyAdmin/MySQL Workbench
```

### Step 4: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### Step 5: Test the API

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register a User:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123456",
    "phone": "9876543210"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

## 📝 Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Check if server is running
curl http://localhost:5000/health
```

## 🔧 Troubleshooting

### Database Connection Error
- Verify database credentials in `.env`
- Ensure MySQL server is running
- Check if database exists
- Verify user has proper permissions

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 5000

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

## 📚 Next Steps

1. Read the full [README.md](./README.md) for detailed documentation
2. Check [STRUCTURE.md](./STRUCTURE.md) for project architecture
3. Review API endpoints in README.md
4. Set up your frontend to connect to this backend

## 🔐 Security Notes

- **Never commit `.env` file to git**
- Change `JWT_SECRET` to a strong random string in production
- Update `CORS_ORIGIN` to your production domain
- Use environment-specific configurations

