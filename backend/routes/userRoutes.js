import express from 'express';
import User from '../models/User.js';
import Video from '../models/Video.js';
import { authenticate } from '../middleware/auth.js';
import { uploadAvatar, uploadCoverImage } from '../middleware/upload.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get user profile by username
router.get('/users/c/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() })
      .select('-password -refreshToken -emailVerificationToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get subscriber count
    const Subscription = (await import('../models/Subscription.js')).default;
    const subscribersCount = await Subscription.countDocuments({ channel: user._id });

    // Check if current user is subscribed
    let isSubscribed = false;
    if (req.user) {
      const subscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: user._id
      });
      isSubscribed = !!subscription;
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        subscribersCount,
        isSubscribed
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user videos
router.get('/users/c/:username/videos', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const videos = await Video.find({ owner: user._id, isPublished: true })
      .populate('owner', 'username fullname avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Get user videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update watch history
router.post('/users/update-watch-history/', authenticate, async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.watchHistory.includes(videoId)) {
      user.watchHistory.push(videoId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Watch history updated'
    });
  } catch (error) {
    console.error('Update watch history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get watch history
router.get('/users/watch-history', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'watchHistory',
      populate: { path: 'owner', select: 'username fullname avatar' }
    });

    res.status(200).json({
      success: true,
      data: user.watchHistory || []
    });
  } catch (error) {
    console.error('Get watch history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete from watch history
router.delete('/users/watch-history', authenticate, async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findById(req.user._id);

    user.watchHistory = user.watchHistory.filter(id => id.toString() !== videoId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Video removed from watch history'
    });
  } catch (error) {
    console.error('Delete watch history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Clear watch history
router.delete('/users/watch-history/clear', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.watchHistory = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Watch history cleared'
    });
  } catch (error) {
    console.error('Clear watch history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update avatar
router.patch('/users/avatar', authenticate, uploadAvatar, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Avatar file is required'
      });
    }

    const user = await User.findById(req.user._id);
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: { avatar: user.avatar }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update cover image
router.patch('/users/coverImage', authenticate, uploadCoverImage, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Cover image file is required'
      });
    }

    const user = await User.findById(req.user._id);
    user.coverImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cover image updated successfully',
      data: { coverImage: user.coverImage }
    });
  } catch (error) {
    console.error('Update cover image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update account
router.patch('/users/update-account', authenticate, async (req, res) => {
  try {
    const { fullname, email, about } = req.body;
    const user = await User.findById(req.user._id);

    if (fullname) user.fullname = fullname;
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      user.email = email.toLowerCase();
      user.isEmailVerified = false; // Require re-verification
    }
    if (about !== undefined) user.about = about;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(200).json({
      success: true,
      message: 'Account updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Change password
router.post('/users/change-password', authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Password change not available for Google users'
      });
    }

    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete account
router.delete('/users/delete-account', authenticate, async (req, res) => {
  try {
    // Delete user's videos, comments, likes, subscriptions, etc.
    await Video.deleteMany({ owner: req.user._id });
    
    const Comment = (await import('../models/Comment.js')).default;
    await Comment.deleteMany({ owner: req.user._id });
    
    const Like = (await import('../models/Like.js')).default;
    await Like.deleteMany({ likedBy: req.user._id });
    
    const Subscription = (await import('../models/Subscription.js')).default;
    await Subscription.deleteMany({ $or: [{ subscriber: req.user._id }, { channel: req.user._id }] });
    
    const Playlist = (await import('../models/Playlist.js')).default;
    await Playlist.deleteMany({ owner: req.user._id });

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
