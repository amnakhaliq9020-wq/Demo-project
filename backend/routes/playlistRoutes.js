import express from 'express';
import Playlist from '../models/Playlist.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user playlists
router.get('/playlist/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const playlists = await Playlist.find({ owner: user._id })
      .populate('videos', 'title thumbnail views createdAt')
      .populate('owner', 'username fullname avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: playlists
    });
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;

