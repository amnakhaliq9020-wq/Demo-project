# VidShare Backend API

Complete backend API for VidShare video sharing platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
`.env` file is already created. Update these values if needed:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Random secret key
- `EMAIL_USER` and `EMAIL_PASS` - For email verification (optional)

### 3. Start Server
```bash
npm run dev
```

### 4. Test
Open browser: **http://localhost:5000/test**

---

## 📡 API Endpoints

### Authentication
- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `POST /users/verify/:userId/:token` - Verify email
- `GET /users/current-user` - Get current user (protected)
- `POST /auth/google` - Google OAuth login

### Videos
- `GET /videos` - Get all videos
- `GET /videos/:id` - Get video by ID
- `GET /videos/related/:id` - Get related videos
- `GET /videos/search?q=query` - Search videos
- `GET /videos/subscribedVideos` - Get subscribed videos (protected)
- `POST /videos/upload` - Upload video (protected)
- `DELETE /videos/:id` - Delete video (protected)
- `PATCH /videos/incrementViewCount/:id` - Increment view count

### Users
- `GET /users/c/:username` - Get user profile
- `GET /users/c/:username/videos` - Get user videos
- `GET /users/watch-history` - Get watch history (protected)
- `POST /users/update-watch-history/` - Update watch history (protected)
- `PATCH /users/avatar` - Update avatar (protected)
- `PATCH /users/coverImage` - Update cover image (protected)
- `PATCH /users/update-account` - Update account (protected)
- `POST /users/change-password` - Change password (protected)
- `DELETE /users/delete-account` - Delete account (protected)

### Comments
- `GET /comments/:videoId` - Get comments
- `POST /comments/:videoId` - Add comment (protected)
- `PUT /comments/:commentId` - Update comment (protected)
- `DELETE /comments/:commentId` - Delete comment (protected)

### Likes
- `POST /likes/toggle-video-like/:videoId` - Toggle like (protected)
- `POST /likes/toggle-video-dislike/:videoId` - Toggle dislike (protected)
- `GET /likes/liked-videos` - Get liked videos (protected)
- `GET /likes/disliked-videos` - Get disliked videos (protected)

### Subscriptions
- `POST /subscription/toggle/:channelId` - Toggle subscription (protected)
- `GET /subscription/subscribed` - Get subscribed channels (protected)
- `GET /subscription/subscribers/:channelId` - Get subscriber count

### Playlists
- `GET /playlist/:username` - Get user playlists

### Notifications
- `GET /notifications` - Get notifications (protected)
- `PUT /notifications/mark-read` - Mark as read (protected)

---

## 🧪 Testing

### Single Testing Link
**http://localhost:5000/test**

This page allows you to test:
- User Registration
- Email Verification
- User Login
- Get Current User

---

## 📝 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vidshare
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🗄️ Database Models

- **User** - User accounts
- **Video** - Video uploads
- **Comment** - Video comments
- **Like** - Video likes/dislikes
- **Subscription** - Channel subscriptions
- **Playlist** - User playlists
- **Notification** - User notifications

---

## ✅ Setup Complete!

Backend is ready. Start the server and test at: **http://localhost:5000/test**
