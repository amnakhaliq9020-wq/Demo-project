import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoFile: {
    type: String,
    required: [true, 'Video file is required']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  duration: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Video = mongoose.model('Video', videoSchema);

export default Video;

