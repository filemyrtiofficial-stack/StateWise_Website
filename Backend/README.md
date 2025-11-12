# FileMyRTI Backend API

Production-ready Node.js + Express.js backend with MySQL database.

## 🚀 Features

- **MVC Architecture**: Clean separation of concerns
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Well-structured REST endpoints
- **MySQL Database**: Connection pooling for optimal performance
- **Security**: Helmet, CORS, Rate Limiting, XSS Protection
- **Validation**: Express-validator for input validation
- **Error Handling**: Centralized error handling middleware
- **Logging**: Comprehensive logging system
- **Environment Configuration**: Secure environment variable management

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js          # Database configuration and connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── serviceController.js # Service operations
│   ├── stateController.js   # State operations
│   └── rtiApplicationController.js # RTI application operations
├── middlewares/
│   ├── auth.js              # JWT authentication middleware
│   ├── validation.js         # Validation error handler
│   ├── errorHandler.js       # Global error handler
│   ├── security.js           # Security middlewares
│   └── role.js               # Role-based access control
├── models/
│   ├── User.js               # User model
│   ├── Service.js            # Service model
│   ├── State.js               # State model
│   └── RTIApplication.js     # RTI Application model
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── userRoutes.js         # User routes
│   ├── serviceRoutes.js      # Service routes
│   ├── stateRoutes.js        # State routes
│   ├── rtiApplicationRoutes.js # RTI Application routes
│   └── index.js              # Route aggregator
├── validators/
│   ├── authValidator.js      # Auth validation rules
│   └── rtiApplicationValidator.js # RTI validation rules
├── utils/
│   ├── jwt.js                # JWT utilities
│   ├── response.js           # Response helpers
│   └── logger.js             # Logging utility
├── .env                      # Environment variables
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
├── server.js                # Server entry point
└── README.md                # This file
```

## 🛠️ Installation

1. **Install dependencies:**
```bash
cd Backend
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start the server:**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

JWT_SECRET=yourSecretKeyChangeThisInProduction
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Razorpay Payment Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> **Note**: For payment integration setup, see [PAYMENT_SETUP.md](./PAYMENT_SETUP.md)

## 🗄️ Database Setup

The backend expects the following tables:

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Services Table
```sql
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  full_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  button_text VARCHAR(50),
  icon VARCHAR(10),
  icon_text VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### States Table
```sql
CREATE TABLE states (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  rti_portal_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### RTI Applications Table
```sql
CREATE TABLE rti_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  service_id INT NOT NULL,
  state_id INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  rti_query TEXT NOT NULL,
  address TEXT NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  status ENUM('pending', 'submitted', 'in_progress', 'completed', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get current user profile (Protected)

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Services
- `GET /api/v1/services` - Get all services
- `GET /api/v1/services/:slug` - Get service by slug
- `POST /api/v1/services` - Create service (Admin only)
- `PUT /api/v1/services/:id` - Update service (Admin only)
- `DELETE /api/v1/services/:id` - Delete service (Admin only)

### States
- `GET /api/v1/states` - Get all states
- `GET /api/v1/states/:slug` - Get state by slug
- `POST /api/v1/states` - Create state (Admin only)
- `PUT /api/v1/states/:id` - Update state (Admin only)
- `DELETE /api/v1/states/:id` - Delete state (Admin only)

### RTI Applications
- `POST /api/v1/rti-applications` - Create RTI application (Protected)
- `GET /api/v1/rti-applications` - Get all applications (Admin) / User's applications
- `GET /api/v1/rti-applications/my-applications` - Get user's applications
- `GET /api/v1/rti-applications/:id` - Get application by ID
- `PUT /api/v1/rti-applications/:id` - Update application
- `PATCH /api/v1/rti-applications/:id/status` - Update application status (Admin only)
- `DELETE /api/v1/rti-applications/:id` - Delete application

### Health Check
- `GET /health` - Server health check

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📦 Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🛡️ Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Cross-Origin Resource Sharing configuration
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **XSS Protection**: Sanitizes user input
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Input Validation**: Express-validator for data validation

## 🚀 Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update database credentials
3. Set a strong `JWT_SECRET`
4. Configure CORS origin for production domain
5. Use process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name filemyrti-backend
```

## 📝 License

ISC

## 👥 Author

FileMyRTI Team

