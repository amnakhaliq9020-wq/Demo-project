# 🚀 Backend Server Setup Guide

## Quick Setup Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

`.env` file already created. Update these values:

**Required:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Random secret key (already set, but change in production)
- `JWT_REFRESH_SECRET` - Random secret key (already set)

**Optional (for email verification):**
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASS` - Gmail App Password

### 3. MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. `.env` file mein: `MONGODB_URI=mongodb://localhost:27017/vidshare`

**Option B: MongoDB Atlas (Free Cloud)**
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. `.env` file mein: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vidshare`

### 4. Email Setup (Optional - for email verification)

**Gmail App Password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification (if not already)
3. Generate App Password for "Mail"
4. Copy 16-character password
5. `.env` file mein paste: `EMAIL_PASS=xxxx xxxx xxxx xxxx`

### 5. Start Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### 6. Verify Server is Running

Open browser:
- Health Check: http://localhost:5000/health
- API Info: http://localhost:5000/

You should see:
```json
{
  "success": true,
  "status": "OK"
}
```

## Testing

### Browser Testing:
Open: `backend/test.html` in browser

### API Endpoints:
- Register: `POST http://localhost:5000/users/register`
- Login: `POST http://localhost:5000/users/login`
- Verify: `POST http://localhost:5000/users/verify/:userId/:token`

## Troubleshooting

### MongoDB Connection Error?
- Check if MongoDB is running
- Verify connection string in `.env`
- Check MongoDB Atlas network access (if using Atlas)

### Port 5000 Already in Use?
- Change `PORT` in `.env` file
- Or kill process using port 5000

### Email Not Sending?
- Check Gmail App Password
- Verify email credentials in `.env`
- Check console logs for errors

## Next Steps

1. ✅ Dependencies installed
2. ✅ `.env` file created
3. ⚠️ Configure MongoDB
4. ⚠️ Configure Email (optional)
5. ✅ Start server: `npm run dev`

---

**Server ready! 🎉**

