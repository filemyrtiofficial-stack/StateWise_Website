# Backend Folder Structure

```
Backend/
├── config/
│   └── database.js              # MySQL database connection and configuration
│
├── controllers/                 # Business logic layer
│   ├── authController.js        # Authentication (register, login, profile)
│   ├── userController.js        # User CRUD operations
│   ├── serviceController.js      # Service CRUD operations
│   ├── stateController.js       # State CRUD operations
│   └── rtiApplicationController.js # RTI Application operations
│
├── middlewares/                 # Express middlewares
│   ├── auth.js                  # JWT authentication middleware
│   ├── validation.js            # Validation error handler
│   ├── errorHandler.js          # Global error handler
│   ├── security.js              # Security middlewares (helmet, cors, rate-limit, xss)
│   └── role.js                  # Role-based access control
│
├── models/                      # Database models (data access layer)
│   ├── User.js                  # User model with database queries
│   ├── Service.js               # Service model
│   ├── State.js                 # State model
│   └── RTIApplication.js        # RTI Application model
│
├── routes/                      # API route definitions
│   ├── authRoutes.js            # Authentication routes
│   ├── userRoutes.js            # User routes
│   ├── serviceRoutes.js         # Service routes
│   ├── stateRoutes.js           # State routes
│   ├── rtiApplicationRoutes.js # RTI Application routes
│   └── index.js                 # Route aggregator
│
├── validators/                  # Input validation rules
│   ├── authValidator.js         # Authentication validation
│   └── rtiApplicationValidator.js # RTI Application validation
│
├── utils/                       # Utility functions
│   ├── jwt.js                   # JWT token generation/verification
│   ├── response.js              # Standardized API responses
│   └── logger.js                 # Logging utility
│
├── database/
│   └── setup.sql                # Database schema setup script
│
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── server.js                    # Main entry point
├── README.md                    # Documentation
└── STRUCTURE.md                 # This file
```

## Key Files Explained

### server.js
Main entry point that:
- Sets up Express app
- Configures middlewares
- Connects to database
- Starts the server
- Handles graceful shutdown

### config/database.js
- MySQL connection pool configuration
- Database query helper functions
- Connection testing

### Models (models/)
Each model contains:
- Database CRUD operations
- Query methods
- Data validation at model level

### Controllers (controllers/)
- Handle HTTP requests/responses
- Call models for data operations
- Business logic implementation
- Error handling

### Routes (routes/)
- Define API endpoints
- Apply middlewares
- Connect controllers to URLs

### Middlewares
- **auth.js**: JWT token verification
- **validation.js**: Express-validator error handling
- **errorHandler.js**: Centralized error handling
- **security.js**: Security configurations
- **role.js**: Role-based access control

### Validators
- Input validation rules using express-validator
- Reusable validation middleware

### Utils
- **jwt.js**: JWT token operations
- **response.js**: Standardized API response format
- **logger.js**: Logging utility

## API Endpoints Summary

### Base URL: `/api/v1`

**Authentication:**
- `POST /auth/register` - Register
- `POST /auth/login` - Login
- `GET /auth/profile` - Get profile (Protected)

**Users:**
- `GET /users` - List users (Admin)
- `GET /users/:id` - Get user (Protected)
- `PUT /users/:id` - Update user (Protected)
- `DELETE /users/:id` - Delete user (Admin)

**Services:**
- `GET /services` - List services (Public)
- `GET /services/:slug` - Get service (Public)
- `POST /services` - Create service (Admin)
- `PUT /services/:id` - Update service (Admin)
- `DELETE /services/:id` - Delete service (Admin)

**States:**
- `GET /states` - List states (Public)
- `GET /states/:slug` - Get state (Public)
- `POST /states` - Create state (Admin)
- `PUT /states/:id` - Update state (Admin)
- `DELETE /states/:id` - Delete state (Admin)

**RTI Applications:**
- `POST /rti-applications` - Create application (Protected)
- `GET /rti-applications` - List applications (Protected)
- `GET /rti-applications/my-applications` - User's applications (Protected)
- `GET /rti-applications/:id` - Get application (Protected)
- `PUT /rti-applications/:id` - Update application (Protected)
- `PATCH /rti-applications/:id/status` - Update status (Admin)
- `DELETE /rti-applications/:id` - Delete application (Protected)

**Health:**
- `GET /health` - Server health check

