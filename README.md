# VidShare - Video Sharing Platform

VidShare ek modern video sharing platform hai jo React aur Vite se banaya gaya hai. Ye platform users ko videos upload karne, dekhne, like/dislike karne, aur channels subscribe karne ki facility deta hai.

## 📋 Project Overview

Yeh ek full-stack video sharing application hai jisme:
- **Frontend**: React + Vite + Redux Toolkit + Tailwind CSS
- **Backend**: Node.js/Express (separate repository mein ho sakta hai)
- **Main Features**: User Authentication, Email Verification, Video Upload, Video Streaming, Comments, Likes/Dislikes, Subscriptions

## ✨ Key Features

### 🔐 Authentication & User Management
- **User Registration (Sign Up)**: 
  - Full Name, Email, Username, Password ke saath sign up
  - Password validation (minimum 6 characters)
  - Password confirmation check
- **User Login**: 
  - Email aur Password se login
  - JWT token-based authentication
  - Access Token aur Refresh Token management
- **Email Verification**: 
  - Sign up ke baad email verification required
  - Verification link `/verify/:userId/:token` route par handle hota hai
  - Email verify hone ke baad hi user login kar sakta hai
- **Google OAuth Sign In**: 
  - Google account se direct sign in option
  - Google OAuth integration available

### 🎥 Video Features
- Video Upload (Cloudinary integration)
- Video Streaming (Cloudinary Video Player)
- Video Details Page
- Related Videos Display
- Video Comments System
- Like/Dislike Videos
- Watch History Tracking
- Video View Count

### 👤 User Features
- User Profile Pages
- User Settings
- Liked Videos Collection
- Watch History
- Subscriptions Management
- Channel Subscribers Count

### 🔍 Other Features
- Search Functionality
- Protected Routes (Authentication required)
- Responsive Design (Mobile-friendly)
- Error Handling & Loading States
- Notification System

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI Library
- **Vite 5.3.1** - Build Tool & Dev Server
- **Redux Toolkit 2.2.6** - State Management
- **React Router DOM 6.24.1** - Routing
- **Tailwind CSS 3.4.4** - Styling
- **Axios 1.7.2** - HTTP Client
- **Cloudinary Video Player 2.0.5** - Video Streaming
- **React Icons 5.2.1** - Icons
- **Moment.js 2.30.1** - Date Formatting
- **Google OAuth** - Social Authentication

## 📁 Project Structure

```
project 1/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js              # Redux store configuration
│   │   ├── components/
│   │   │   ├── videos/               # Video-related components
│   │   │   │   ├── VideoCard.jsx
│   │   │   │   ├── VideoPlayer.jsx
│   │   │   │   ├── VideoDetails.jsx
│   │   │   │   ├── Comments.jsx
│   │   │   │   └── ...
│   │   │   ├── Avatar.jsx
│   │   │   ├── EmailVerify.jsx       # Email verification component
│   │   │   ├── GoogleSignIn.jsx      # Google OAuth component
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── UploadForm.jsx
│   │   │   └── ...
│   │   ├── features/
│   │   │   ├── UserSlice.js          # User state management (login, signup, etc.)
│   │   │   ├── videosSlice.js        # Videos state management
│   │   │   ├── MenuSlice.js
│   │   │   └── NotificationSlice.js
│   │   ├── pages/
│   │   │   ├── SignIn.jsx            # Login/Signup page
│   │   │   ├── Home.jsx
│   │   │   ├── SinglepageVideo.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── UserSettings.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── LikedVideos.jsx
│   │   │   ├── WatchHistory.jsx
│   │   │   └── Subscriptions.jsx
│   │   ├── utils/
│   │   │   ├── api.js                # API helper functions
│   │   │   └── axiosInstance.js     # Axios configuration
│   │   ├── App.jsx                   # Main App component with routes
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000` (or configure your own)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/amnakhaliq9020-wq/Demo-project.git
   cd Demo-project
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create environment file**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_REACT_APP_BASE_URL=http://localhost:5000
   VITE_REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🔌 API Endpoints (Backend Expected)

Based on the frontend code, yeh API endpoints backend mein expected hain:

### Authentication Endpoints
- `POST /users/register` - User registration (signup)
  - Body: `{ fullname, email, username, password }`
- `POST /users/login` - User login
  - Body: `{ email, password }`
  - Returns: `{ accessToken, refreshToken, user }`
- `POST /users/verify/:userId/:token` - Email verification
- `GET /users/current-user` - Get current logged-in user
- `POST /auth/google` - Google OAuth authentication
  - Body: `{ token }`

### Video Endpoints
- `GET /videos` - Get all videos
- `GET /videos/:id` - Get video by ID
- `POST /videos/upload` - Upload video (multipart/form-data)
- `DELETE /videos/:id` - Delete video
- `PATCH /videos/incrementViewCount/:videoId` - Increment view count
- `GET /users/c/:username/videos` - Get user's videos

### User Endpoints
- `POST /users/update-watch-history/` - Update watch history
  - Body: `{ videoId }`

### Subscription Endpoints
- `GET /subscription/subscribed` - Get subscribed channels
- `GET /subscription/subscribers/:channelId` - Get channel subscribers

### Like/Dislike Endpoints
- `GET /likes/liked-videos` - Get liked videos
- `GET /likes/disliked-videos` - Get disliked videos

## 🔐 Authentication Flow

1. **Sign Up Process**:
   - User sign up form fill karta hai (fullname, email, username, password)
   - Backend user create karta hai aur verification email send karta hai
   - User ko email verification link milta hai
   - User link click karke email verify karta hai
   - Verification successful hone ke baad user login kar sakta hai

2. **Login Process**:
   - User email aur password se login karta hai
   - Backend JWT tokens return karta hai
   - Tokens localStorage mein save hote hain
   - Protected routes access karne ke liye token use hota hai

3. **Email Verification**:
   - Route: `/verify/:userId/:token`
   - Component: `EmailVerify.jsx`
   - Verification successful hone par user automatically login page par redirect hota hai

## 🎨 Key Components

### SignIn Component (`pages/SignIn.jsx`)
- Login aur Sign Up dono forms handle karta hai
- Form validation
- Error handling
- Google Sign In integration
- Success/Error dialogs

### EmailVerify Component (`components/EmailVerify.jsx`)
- Email verification link handle karta hai
- Success/Error states display karta hai
- Auto-redirect to login after verification

### Protected Routes
- `ProtectedRoute` component authentication check karta hai
- Agar user logged in nahi hai to `/login` par redirect karta hai

## 📝 Environment Variables

```env
# Backend API URL
VITE_REACT_APP_BASE_URL=http://localhost:5000

# Google OAuth Client ID (optional)
VITE_REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🚢 Deployment

Project Vercel ke liye configured hai (`vercel.json` file present hai).

### Vercel Deployment
1. Vercel account se connect karein
2. Repository select karein
3. Environment variables add karein
4. Deploy karein

## 📄 License

This project is private.

## 👤 Author

- GitHub: [@amnakhaliq9020-wq](https://github.com/amnakhaliq9020-wq)

## 📞 Support

Agar koi issue ya question ho to GitHub repository par issue create karein.

---

**Note**: Backend server alag se run karna hoga. Frontend `http://localhost:5000` par backend expect karta hai (ya jo bhi `VITE_REACT_APP_BASE_URL` mein configure ho).

