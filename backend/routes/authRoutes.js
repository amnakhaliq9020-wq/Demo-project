import express from 'express';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { sendVerificationEmail } from '../utils/emailService.js';
import { authenticate } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post('/users/register', async (req, res) => {
  try {
    const { fullname, email, username, password } = req.body;

    if (!fullname || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
      if (existingUser.username === username.toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    const user = new User({
      fullname,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password
    });

    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    const emailResult = await sendVerificationEmail(
      user.email,
      user.fullname,
      verificationToken,
      user._id.toString()
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        userId: user._id,
        email: user.email,
        username: user.username,
        fullname: user.fullname
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login
router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isEmailVerified && !user.isGoogleUser) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for verification link.'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.emailVerificationToken;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: userResponse
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// Verify Email
router.post('/users/verify/:userId/:token', async (req, res) => {
  try {
    const { userId, token } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    if (user.emailVerificationToken !== hashedToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    if (user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired. Please request a new verification email.'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now login.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
      error: error.message
    });
  }
});

// Get Current User
router.get('/users/current-user', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken -emailVerificationToken');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Google OAuth
router.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: 'Google OAuth not configured'
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user
      user = new User({
        email: email.toLowerCase(),
        fullname: name,
        username: email.split('@')[0].toLowerCase() + '_' + sub.slice(0, 6),
        avatar: picture,
        isEmailVerified: true,
        isGoogleUser: true
      });
      await user.save();
    } else {
      // Update existing user
      if (!user.avatar) user.avatar = picture;
      if (!user.isEmailVerified) user.isEmailVerified = true;
      user.isGoogleUser = true;
      await user.save();
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: userResponse
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
  }
});

export default router;

