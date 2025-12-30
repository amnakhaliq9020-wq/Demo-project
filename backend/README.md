# VidShare Backend API

Backend API for VidShare video sharing platform with authentication and email verification.

## 🚀 Features

- ✅ User Registration (Sign Up)
- ✅ User Login with JWT tokens
- ✅ Email Verification
- ✅ Protected Routes
- ✅ MongoDB Database
- ✅ Password Hashing (bcrypt)
- ✅ JWT Authentication

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email verification)

## 🛠️ Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   Copy `.env.example` and fill in your values:
   ```bash
   # Windows
   copy .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

4. **Configure `.env` file**
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB - Use local MongoDB or MongoDB Atlas
   MONGODB_URI=mongodb://localhost:27017/vidshare
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vidshare
   
   # JWT Secrets (generate strong random strings)
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_REFRESH_SECRET=your_super_secret_refresh_token_key
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   
   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

## 📧 Gmail Setup for Email Verification

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "VidShare" as the name
   - Copy the generated 16-character password
   - Use this password in `EMAIL_PASS` in `.env`

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/vidshare`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vidshare`

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### 1. Register User
```http
POST /users/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "userId": "...",
    "email": "john@example.com",
    "username": "johndoe",
    "fullname": "John Doe"
  }
}
```

### 2. Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "fullname": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "isEmailVerified": true
    }
  }
}
```

### 3. Verify Email
```http
POST /users/verify/:userId/:token
```

**Example:**
```
POST /users/verify/507f1f77bcf86cd799439011/abc123def456...
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now login."
}
```

### 4. Get Current User (Protected)
```http
GET /users/current-user
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "fullname": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "isEmailVerified": true
  }
}
```

## 🧪 Testing with Postman/Thunder Client

### 1. Register a User
- Method: `POST`
- URL: `http://localhost:5000/users/register`
- Body (JSON):
  ```json
  {
    "fullname": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "test123"
  }
  ```

### 2. Check Email
- Registration ke baad email check karein
- Email mein verification link milega
- Link format: `http://localhost:5173/verify/{userId}/{token}`

### 3. Verify Email
- Method: `POST`
- URL: `http://localhost:5000/users/verify/{userId}/{token}`
- Email se userId aur token copy karein

### 4. Login
- Method: `POST`
- URL: `http://localhost:5000/users/login`
- Body (JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "test123"
  }
  ```
- Response mein `accessToken` copy karein

### 5. Get Current User
- Method: `GET`
- URL: `http://localhost:5000/users/current-user`
- Headers:
  ```
  Authorization: Bearer {accessToken}
  ```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Email verification required before login
- Token expiration (7 days for access, 30 days for refresh)
- CORS enabled for frontend
- Input validation

## 📝 Error Handling

All errors return in this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

Common error codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `403` - Forbidden (email not verified)
- `404` - Not Found
- `500` - Internal Server Error

## 🐛 Troubleshooting

### Email not sending?
1. Check Gmail App Password is correct
2. Verify 2-Step Verification is enabled
3. Check `.env` file has correct email credentials
4. Check console logs for email errors

### MongoDB connection error?
1. Verify MongoDB is running (if local)
2. Check MongoDB Atlas connection string
3. Verify network access in MongoDB Atlas (whitelist IP)

### Port already in use?
- Change `PORT` in `.env` file
- Or kill process using port 5000

## 📦 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   └── User.js             # User schema
├── routes/
│   └── userRoutes.js       # User authentication routes
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── utils/
│   ├── emailService.js     # Email sending service
│   └── generateTokens.js   # JWT token generation
├── server.js               # Main server file
├── package.json
└── README.md
```

## 🔗 Frontend Integration

Frontend se connect karne ke liye:
1. Frontend `.env` mein: `VITE_REACT_APP_BASE_URL=http://localhost:5000`
2. Backend server start karein
3. Frontend server start karein

## 📄 License

Private project

---

**Note**: Production mein deploy karne se pehle:
- Strong JWT secrets use karein
- MongoDB Atlas use karein (not local)
- Environment variables properly set karein
- HTTPS enable karein

