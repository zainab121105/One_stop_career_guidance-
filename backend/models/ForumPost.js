import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: 5000
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Engineering', 
      'Medical', 
      'Business', 
      'Arts', 
      'Science', 
      'Career Change', 
      'Career Choice',
      'Job Search',
      'Education',
      'Technology',
      'General'
    ]
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'pinned'],
    default: 'active'
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  replies: [{
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    content: {
      type: String,
      required: [true, 'Reply content is required'],
      maxlength: 2000
    },
    likes: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      likedAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    isAccepted: {
      type: Boolean,
      default: false
    }
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for like count
forumPostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for reply count
forumPostSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Pre-save hook to update excerpt
forumPostSchema.pre('save', function(next) {
  if (this.content && this.content.length > 150) {
    this.excerpt = this.content.substring(0, 147) + '...';
  } else {
    this.excerpt = this.content;
  }
  next();
});

// Index for better performance
forumPostSchema.index({ category: 1 });
forumPostSchema.index({ createdAt: -1 });
forumPostSchema.index({ lastActivity: -1 });
forumPostSchema.index({ status: 1 });
forumPostSchema.index({ tags: 1 });

export default mongoose.model('ForumPost', forumPostSchema);