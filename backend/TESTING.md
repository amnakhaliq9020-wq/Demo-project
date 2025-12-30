# Testing Guide - VidShare Backend

## 🧪 Quick Testing Steps

### Step 1: Setup Backend
```bash
cd backend
npm install
```

### Step 2: Configure Environment
Create `.env` file with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vidshare
JWT_SECRET=test_secret_key_12345
JWT_REFRESH_SECRET=test_refresh_secret_12345
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Step 3: Start Server
```bash
npm run dev
```

Server should show:
```
MongoDB Connected: ...
🚀 Server running on port 5000
```

## 📝 Testing with cURL

### 1. Register User
```bash
curl -X POST http://localhost:5000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "test123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "userId": "...",
    "email": "test@example.com",
    "username": "testuser",
    "fullname": "Test User"
  }
}
```

### 2. Check Email for Verification Link
- Email inbox check karein
- Verification link copy karein
- Format: `http://localhost:5173/verify/{userId}/{token}`

### 3. Verify Email
```bash
# Replace {userId} and {token} with actual values from email
curl -X POST http://localhost:5000/users/verify/{userId}/{token}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now login."
}
```

### 4. Login
```bash
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "fullname": "Test User",
      "email": "test@example.com",
      "username": "testuser",
      "isEmailVerified": true
    }
  }
}
```

### 5. Get Current User (Protected Route)
```bash
# Replace {accessToken} with token from login response
curl -X GET http://localhost:5000/users/current-user \
  -H "Authorization: Bearer {accessToken}"
```

## 🌐 Testing with Browser/Postman

### Using Postman or Thunder Client (VS Code Extension)

1. **Create Collection**: "VidShare API"

2. **Register Request**:
   - Method: `POST`
   - URL: `http://localhost:5000/users/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "fullname": "John Doe",
       "email": "john@example.com",
       "username": "johndoe",
       "password": "password123"
     }
     ```

3. **Verify Email Request**:
   - Method: `POST`
   - URL: `http://localhost:5000/users/verify/{userId}/{token}`
   - Replace `{userId}` and `{token}` from email

4. **Login Request**:
   - Method: `POST`
   - URL: `http://localhost:5000/users/login`
   - Body:
     ```json
     {
       "email": "john@example.com",
       "password": "password123"
     }
     ```
   - Response se `accessToken` copy karein

5. **Get Current User Request**:
   - Method: `GET`
   - URL: `http://localhost:5000/users/current-user`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer {accessToken}`

## ✅ Test Cases

### Test Case 1: Successful Registration
- ✅ User register ho jata hai
- ✅ Email verification link send hota hai
- ✅ User database mein save hota hai

### Test Case 2: Email Verification
- ✅ Verification link se email verify hota hai
- ✅ Invalid token par error aata hai
- ✅ Expired token par error aata hai

### Test Case 3: Login
- ✅ Verified user login kar sakta hai
- ✅ Unverified user login nahi kar sakta
- ✅ Wrong password par error
- ✅ JWT tokens return hote hain

### Test Case 4: Protected Routes
- ✅ Valid token se protected route access hota hai
- ✅ Invalid token par 401 error
- ✅ No token par 401 error

## 🐛 Common Issues

### Issue: Email not sending
**Solution:**
- Gmail App Password check karein
- `.env` file mein email credentials verify karein
- Console logs check karein

### Issue: MongoDB connection error
**Solution:**
- MongoDB service running hai ya nahi check karein
- Connection string verify karein
- MongoDB Atlas mein network access allow karein

### Issue: "Email already registered"
**Solution:**
- Different email use karein
- Ya database se existing user delete karein

### Issue: "Email not verified" error on login
**Solution:**
- Email verification link click karein
- Ya manually verify endpoint call karein

## 🔗 Frontend Testing

1. Backend server start karein: `npm run dev`
2. Frontend server start karein: `cd ../frontend && npm run dev`
3. Browser mein `http://localhost:5173` open karein
4. Sign up form fill karein
5. Email check karein
6. Verification link click karein
7. Login karein

## 📊 Expected Flow

```
1. User Registration
   ↓
2. Email Sent with Verification Link
   ↓
3. User Clicks Link / Calls Verify API
   ↓
4. Email Verified
   ↓
5. User Can Now Login
   ↓
6. Get Access Token
   ↓
7. Use Token for Protected Routes
```

---

**Happy Testing! 🚀**

