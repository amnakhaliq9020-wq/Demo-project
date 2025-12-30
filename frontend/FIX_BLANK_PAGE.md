# Fix Blank Page Issue

## Problem:
Page is blank/white when opening http://localhost:5173

## Solution Steps:

1. **Open Browser Console (F12)**
   - Press F12 in browser
   - Go to "Console" tab
   - Check for any red errors

2. **Check Frontend Server**
   - Make sure frontend server is running
   - Check the command window for errors

3. **Try Direct Login Page**
   - Open: http://localhost:5173/login
   - This should show the login page

4. **Clear Browser Cache**
   - Press Ctrl+Shift+Delete
   - Clear cache and reload

5. **Check Environment Variables**
   - Make sure frontend/.env exists
   - Should have: VITE_REACT_APP_BASE_URL=http://localhost:5000

6. **Restart Servers**
   - Stop both servers (Ctrl+C)
   - Start backend: cd backend && npm start
   - Start frontend: cd frontend && npm run dev



