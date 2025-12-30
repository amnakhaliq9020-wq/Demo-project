# 🔧 Troubleshooting Guide

## Problem: `/test` link not working

### Step 1: Check if Server is Running

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📡 API URL: http://localhost:5000
🧪 Testing Page: http://localhost:5000/test
```

### Step 2: Check Server Status

Open in browser:
- http://localhost:5000/health
- http://localhost:5000/

If these don't work, server is not running.

### Step 3: Common Issues

#### Issue 1: Port 5000 Already in Use
**Solution:**
- Change PORT in `.env` file
- Or kill process using port 5000

#### Issue 2: MongoDB Connection Error
**Solution:**
- Check MongoDB is running (if local)
- Or configure MongoDB Atlas connection string in `.env`
- Server will still start but database operations will fail

#### Issue 3: Server Starts but `/test` Shows Error
**Solution:**
- Check console for errors
- Make sure all dependencies installed: `npm install`
- Restart server: `Ctrl+C` then `npm run dev`

### Step 4: Test Directly

1. **Start Server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Open Browser:**
   ```
   http://localhost:5000/test
   ```

3. **If Still Not Working:**
   - Check browser console (F12) for errors
   - Check server console for errors
   - Try: http://localhost:5000/health first

### Step 5: Alternative Testing

If `/test` route doesn't work, use:

1. **Postman/Thunder Client:**
   - POST http://localhost:5000/users/register
   - POST http://localhost:5000/users/login

2. **cURL:**
   ```bash
   curl http://localhost:5000/health
   ```

3. **Browser Console (F12):**
   ```javascript
   fetch('http://localhost:5000/health')
     .then(r => r.json())
     .then(d => console.log(d));
   ```

---

## Quick Fix Commands

```bash
# 1. Go to backend folder
cd backend

# 2. Install dependencies (if not done)
npm install

# 3. Check .env file exists
# If not, create it with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/vidshare
# JWT_SECRET=your_secret
# JWT_REFRESH_SECRET=your_refresh_secret

# 4. Start server
npm run dev

# 5. Open browser
# http://localhost:5000/test
```

---

**Still not working?** Share the error message from:
- Server console
- Browser console (F12)
- Browser error page

