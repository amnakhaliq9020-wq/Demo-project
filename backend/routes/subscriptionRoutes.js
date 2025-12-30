import express from 'express';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Toggle subscription
router.post('/subscription/toggle/:channelId', authenticate, async (req, res) => {
  try {
    const { channelId } = req.params;
    const subscriberId = req.user._id;

    if (channelId === subscriberId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot subscribe to yourself'
      });
    }

    const channel = await User.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }

    let subscription = await Subscription.findOne({
      subscriber: subscriberId,
      channel: channelId
    });

    if (subscription) {
      // Unsubscribe
      await Subscription.findByIdAndDelete(subscription._id);
      res.status(200).json({
        success: true,
        message: 'Unsubscribed successfully',
        data: { isSubscribed: false }
      });
    } else {
      // Subscribe
      subscription = new Subscription({
        subscriber: subscriberId,
        channel: channelId
      });
      await subscription.save();

      res.status(200).json({
        success: true,
        message: 'Subscribed successfully',
        data: { isSubscribed: true }
      });
    }
  } catch (error) {
    console.error('Toggle subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get subscribed channels
router.get('/subscription/subscribed', authenticate, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ subscriber: req.user._id })
      .populate('channel', 'username fullname avatar')
      .sort({ createdAt: -1 });

    const channels = subscriptions.map(sub => sub.channel);

    res.status(200).json({
      success: true,
      data: channels
    });
  } catch (error) {
    console.error('Get subscribed channels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get channel subscribers
router.get('/subscription/subscribers/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;

    const subscribersCount = await Subscription.countDocuments({ channel: channelId });

    res.status(200).json({
      success: true,
      data: { subscribersCount }
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;

