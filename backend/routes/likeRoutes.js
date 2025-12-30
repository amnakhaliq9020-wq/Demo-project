import express from 'express';
import Like from '../models/Like.js';
import Video from '../models/Video.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Toggle video like
router.post('/likes/toggle-video-like/:videoId', authenticate, async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    let like = await Like.findOne({ video: videoId, likedBy: userId });

    if (like && like.isLiked) {
      // Unlike
      await Like.findByIdAndDelete(like._id);
      
      // Decrement like count
      await Video.findByIdAndUpdate(videoId, { $inc: { likes: -1 } });
      
      res.status(200).json({
        success: true,
        message: 'Video unliked',
        data: { isLiked: false }
      });
    } else {
      // Like
      // Remove dislike if exists
      const dislike = await Like.findOne({ video: videoId, likedBy: userId, isLiked: false });
      if (dislike) {
        await Like.findByIdAndDelete(dislike._id);
        await Video.findByIdAndUpdate(videoId, { $inc: { dislikes: -1 } });
      }
      
      if (!like) {
        like = new Like({
          video: videoId,
          likedBy: userId,
          isLiked: true
        });
        await like.save();
        await Video.findByIdAndUpdate(videoId, { $inc: { likes: 1 } });
      } else {
        like.isLiked = true;
        await like.save();
        await Video.findByIdAndUpdate(videoId, { $inc: { likes: 1 } });
      }

      res.status(200).json({
        success: true,
        message: 'Video liked',
        data: { isLiked: true }
      });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Toggle video dislike
router.post('/likes/toggle-video-dislike/:videoId', authenticate, async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    let like = await Like.findOne({ video: videoId, likedBy: userId });

    if (like && !like.isLiked) {
      // Remove dislike
      await Like.findByIdAndDelete(like._id);
      await Video.findByIdAndUpdate(videoId, { $inc: { dislikes: -1 } });
      
      res.status(200).json({
        success: true,
        message: 'Video undisliked',
        data: { isDisliked: false }
      });
    } else {
      // Dislike
      // Remove like if exists
      if (like && like.isLiked) {
        await Like.findByIdAndDelete(like._id);
        await Video.findByIdAndUpdate(videoId, { $inc: { likes: -1 } });
      }
      
      if (!like) {
        like = new Like({
          video: videoId,
          likedBy: userId,
          isLiked: false
        });
        await like.save();
        await Video.findByIdAndUpdate(videoId, { $inc: { dislikes: 1 } });
      } else {
        like.isLiked = false;
        await like.save();
        await Video.findByIdAndUpdate(videoId, { $inc: { dislikes: 1 } });
      }

      res.status(200).json({
        success: true,
        message: 'Video disliked',
        data: { isDisliked: true }
      });
    }
  } catch (error) {
    console.error('Toggle dislike error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get liked videos
router.get('/likes/liked-videos', authenticate, async (req, res) => {
  try {
    const likes = await Like.find({
      likedBy: req.user._id,
      isLiked: true
    })
      .populate({
        path: 'video',
        populate: { path: 'owner', select: 'username fullname avatar' }
      })
      .sort({ createdAt: -1 });

    const likedVideos = likes
      .filter(like => like.video)
      .map(like => ({
        video: like.video,
        _id: like.video._id
      }));

    res.status(200).json({
      success: true,
      data: { likedVideos }
    });
  } catch (error) {
    console.error('Get liked videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get disliked videos
router.get('/likes/disliked-videos', authenticate, async (req, res) => {
  try {
    const likes = await Like.find({
      likedBy: req.user._id,
      isLiked: false
    })
      .populate({
        path: 'video',
        populate: { path: 'owner', select: 'username fullname avatar' }
      })
      .sort({ createdAt: -1 });

    const dislikedVideos = likes
      .filter(like => like.video)
      .map(like => ({
        video: like.video,
        _id: like.video._id
      }));

    res.status(200).json({
      success: true,
      data: { dislikedVideos }
    });
  } catch (error) {
    console.error('Get disliked videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;

