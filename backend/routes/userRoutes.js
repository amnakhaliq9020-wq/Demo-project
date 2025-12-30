import express from 'express';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { sendVerificationEmail } from '../utils/emailService.js';
import { authenticate } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, username, password } = req.body;

    // Validation
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

    // Check if user already exists
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

    // Create new user
    const user = new User({
      fullname,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password
    });

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(
      user.email,
      user.fullname,
      verificationToken,
      user._id.toString()
    );

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Still return success but warn about email
    }

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

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for verification link.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Remove password from response
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

// Verify email
router.post('/verify/:userId/:token', async (req, res) => {
  try {
    const { userId, token } = req.params;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Hash the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Verify token
    if (user.emailVerificationToken !== hashedToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Check if token expired
    if (user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired. Please request a new verification email.'
      });
    }

    // Verify email
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

// Get current user (protected route)
router.get('/current-user', authenticate, async (req, res) => {
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

export default router;

