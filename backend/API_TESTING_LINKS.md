# 🔗 API Testing Links - VidShare Backend

## 🚀 Quick Start

### Base URL
```
http://localhost:5000
```

### Health Check
```
GET http://localhost:5000/health
```
**Test in Browser:** [http://localhost:5000/health](http://localhost:5000/health)

---

## 📝 API Endpoints for Testing

### 1. ✅ User Registration (Sign Up)

**Endpoint:**
```
POST http://localhost:5000/users/register
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:5000/users/register \
  -H "Content-Type: application/json" \
  -d "{\"fullname\":\"John Doe\",\"email\":\"john@example.com\",\"username\":\"johndoe\",\"password\":\"password123\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "john@example.com",
    "username": "johndoe",
    "fullname": "John Doe"
  }
}
```

**Testing Links:**
- **Postman/Thunder Client:** `POST http://localhost:5000/users/register`
- **Browser Test:** N/A (POST request, browser se directly nahi kar sakte)

---

### 2. 📧 Email Verification

**Endpoint:**
```
POST http://localhost:5000/users/verify/:userId/:token
```

**Example:**
```
POST http://localhost:5000/users/verify/65a1b2c3d4e5f6g7h8i9j0k1/abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

**Note:** 
- `userId` aur `token` email se milega
- Registration ke baad email check karein
- Email mein verification link hoga: `http://localhost:5173/verify/{userId}/{token}`

**cURL Command:**
```bash
curl -X POST http://localhost:5000/users/verify/YOUR_USER_ID/YOUR_TOKEN
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now login."
}
```

**Expected Response (Error):**
```json
{
  "success": false,
  "message": "Invalid verification token"
}
```

**Testing Links:**
- **Postman/Thunder Client:** `POST http://localhost:5000/users/verify/{userId}/{token}`
- **Frontend Link:** Email mein jo link aayega wo directly browser mein open kar sakte hain

---

### 3. 🔐 User Login

**Endpoint:**
```
POST http://localhost:5000/users/login
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWExYjJjM2Q0ZTVmNmE3aDhpOWowazEiLCJpYXQiOjE3MDEyMzQ1NjcsImV4cCI6MTcwMTgzOTM2N30.abc123...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWExYjJjM2Q0ZTVmNmE3aDhpOWowazEiLCJpYXQiOjE3MDEyMzQ1NjcsImV4cCI6MTcwNzQyODU2N30.xyz789...",
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "fullname": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "isEmailVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Expected Response (Email Not Verified):**
```json
{
  "success": false,
  "message": "Please verify your email before logging in. Check your inbox for verification link."
}
```

**Expected Response (Wrong Credentials):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Testing Links:**
- **Postman/Thunder Client:** `POST http://localhost:5000/users/login`

---

### 4. 👤 Get Current User (Protected Route)

**Endpoint:**
```
GET http://localhost:5000/users/current-user
```

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**cURL Command:**
```bash
curl -X GET http://localhost:5000/users/current-user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "fullname": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "isEmailVerified": true,
    "avatar": "",
    "coverImage": "",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Testing Links:**
- **Postman/Thunder Client:** `GET http://localhost:5000/users/current-user`

---

## 🧪 Complete Testing Flow

### Step 1: Register a New User
```bash
POST http://localhost:5000/users/register
Body: {
  "fullname": "Test User",
  "email": "test@example.com",
  "username": "testuser",
  "password": "test123"
}
```

### Step 2: Check Email
- Email inbox check karein
- Verification email mein link hoga
- Link format: `http://localhost:5173/verify/{userId}/{token}`

### Step 3: Verify Email
```bash
POST http://localhost:5000/users/verify/{userId}/{token}
```
(Email se userId aur token copy karein)

### Step 4: Login
```bash
POST http://localhost:5000/users/login
Body: {
  "email": "test@example.com",
  "password": "test123"
}
```
Response se `accessToken` copy karein

### Step 5: Test Protected Route
```bash
GET http://localhost:5000/users/current-user
Headers: Authorization: Bearer {accessToken}
```

---

## 🌐 Testing Tools

### Option 1: Postman
1. Postman install karein: https://www.postman.com/downloads/
2. New Request create karein
3. Method aur URL set karein
4. Headers aur Body add karein
5. Send button click karein

### Option 2: Thunder Client (VS Code)
1. VS Code mein Thunder Client extension install karein
2. New Request create karein
3. Method, URL, Headers, Body set karein
4. Send karein

### Option 3: cURL (Command Line)
- Windows: Git Bash ya PowerShell use karein
- Linux/Mac: Terminal use karein

### Option 4: Browser (Frontend)
1. Frontend server start karein: `cd frontend && npm run dev`
2. Browser mein `http://localhost:5173` open karein
3. Sign up form fill karein
4. Email verify karein
5. Login karein

---

## 📋 Test Cases

### ✅ Test Case 1: Successful Registration
- **Request:** POST /users/register with valid data
- **Expected:** 201 status, success message, user data
- **Check:** Email sent confirmation

### ✅ Test Case 2: Duplicate Email Registration
- **Request:** POST /users/register with existing email
- **Expected:** 400 status, "Email already registered"

### ✅ Test Case 3: Email Verification
- **Request:** POST /users/verify/{userId}/{token}
- **Expected:** 200 status, "Email verified successfully"

### ✅ Test Case 4: Login with Verified Email
- **Request:** POST /users/login with verified user
- **Expected:** 200 status, accessToken, refreshToken, user data

### ✅ Test Case 5: Login with Unverified Email
- **Request:** POST /users/login with unverified user
- **Expected:** 403 status, "Please verify your email"

### ✅ Test Case 6: Protected Route Access
- **Request:** GET /users/current-user with valid token
- **Expected:** 200 status, user data

### ❌ Test Case 7: Protected Route Without Token
- **Request:** GET /users/current-user without token
- **Expected:** 401 status, "Authentication required"

---

## 🔗 Quick Test Links (Copy & Use)

### Registration
```
POST http://localhost:5000/users/register
Content-Type: application/json

{
  "fullname": "Test User",
  "email": "test@example.com",
  "username": "testuser",
  "password": "test123"
}
```

### Login
```
POST http://localhost:5000/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```

### Verify Email (Replace userId and token)
```
POST http://localhost:5000/users/verify/YOUR_USER_ID/YOUR_TOKEN
```

### Get Current User (Replace accessToken)
```
GET http://localhost:5000/users/current-user
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## ⚠️ Important Notes

1. **Server must be running:** `npm run dev` in backend folder
2. **MongoDB must be connected:** Check console for connection status
3. **Email configuration:** `.env` mein email settings honi chahiye
4. **Frontend URL:** Email verification links frontend URL use karte hain
5. **Token Expiry:** Access tokens 7 days valid, Refresh tokens 30 days

---

## 🐛 Troubleshooting

### Server not responding?
- Check if server is running: `npm run dev`
- Check port 5000 is not in use
- Check MongoDB connection

### Email not sending?
- Check `.env` file email configuration
- Verify Gmail App Password
- Check console logs for errors

### 401 Unauthorized?
- Check if token is valid
- Check if token is expired
- Check Authorization header format: `Bearer {token}`

---

**Happy Testing! 🚀**

