# ⚡ Quick Start - Backend Server

## 🚀 One-Command Setup

### Windows:
```bash
cd backend
START_SERVER.bat
```

### Or Manual Steps:

#### 1. Create .env file
Create `.env` file in `backend` folder with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vidshare
JWT_SECRET=vidshare_secret_key_2024
JWT_REFRESH_SECRET=vidshare_refresh_secret_2024
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

#### 2. Install Dependencies (if not done)
```bash
cd backend
npm install
```

#### 3. Start Server
```bash
npm run dev
```

#### 4. Test Server
Open browser: http://localhost:5000/health

---

## ✅ Setup Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] MongoDB configured (local or Atlas)
- [ ] Email configured (optional, for email verification)
- [ ] Server started (`npm run dev`)

---

## 📝 Minimal .env Configuration

**Minimum required:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vidshare
JWT_SECRET=any_random_string_here
JWT_REFRESH_SECRET=any_random_string_here
FRONTEND_URL=http://localhost:5173
```

**For email verification (optional):**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

## 🎯 Test After Setup

1. **Health Check:**
   - Browser: http://localhost:5000/health

2. **API Info:**
   - Browser: http://localhost:5000/

3. **Testing Page:**
   - Open: `backend/test.html` in browser

---

**Ready to go! 🚀**

