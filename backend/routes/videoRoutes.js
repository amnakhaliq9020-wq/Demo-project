import express from 'express';
import Video from '../models/Video.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import { authenticate } from '../middleware/auth.js';
import { uploadVideo } from '../middleware/upload.js';

const router = express.Router();

// Get all videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find({ isPublished: true })
      .populate('owner', 'username fullname avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get video by ID
router.get('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('owner', 'username fullname avatar about');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get related videos
router.get('/videos/related/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const relatedVideos = await Video.find({
      _id: { $ne: video._id },
      owner: { $ne: video.owner },
      isPublished: true
    })
      .populate('owner', 'username fullname avatar')
      .limit(10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: relatedVideos
    });
  } catch (error) {
    console.error('Get related videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Search videos
router.get('/videos/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const videos = await Video.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ],
      isPublished: true
    })
      .populate('owner', 'username fullname avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Search videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get subscribed videos
router.get('/videos/subscribedVideos', authenticate, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ subscriber: req.user._id });
    const channelIds = subscriptions.map(sub => sub.channel);

    const videos = await Video.find({
      owner: { $in: channelIds },
      isPublished: true
    })
      .populate('owner', 'username fullname avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Get subscribed videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Upload video
router.post('/videos/upload', authenticate, uploadVideo, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Video file and thumbnail are required'
      });
    }

    const video = new Video({
      title,
      description: description || '',
      videoFile: `/uploads/${req.files.videoFile[0].filename}`,
      thumbnail: `/uploads/${req.files.thumbnail[0].filename}`,
      owner: req.user._id
    });

    await video.save();
    await video.populate('owner', 'username fullname avatar');

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: video
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete video
router.delete('/videos/:id', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    if (video.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own videos'
      });
    }

    // Delete related comments and likes
    const Comment = (await import('../models/Comment.js')).default;
    const Like = (await import('../models/Like.js')).default;
    
    await Comment.deleteMany({ video: video._id });
    await Like.deleteMany({ video: video._id });

    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Increment view count
router.patch('/videos/incrementViewCount/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    video.views += 1;
    await video.save();

    res.status(200).json({
      success: true,
      data: { views: video.views }
    });
  } catch (error) {
    console.error('Increment view count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;

