import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import ForumPost from '../models/ForumPost.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/forum/posts
// @desc    Get all forum posts with filters and pagination
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const {
      category,
      search,
      status = 'active',
      sortBy = 'lastActivity',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { status };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = {};
    
    switch (sortBy) {
      case 'newest':
        sortObj.createdAt = -1;
        break;
      case 'oldest':
        sortObj.createdAt = 1;
        break;
      case 'mostLiked':
        sortObj['likes'] = -1;
        break;
      case 'mostReplies':
        sortObj['replies'] = -1;
        break;
      default:
        sortObj.lastActivity = sortOrder;
    }

    const posts = await ForumPost.find(filter)
      .populate('author.userId', 'name')
      .populate('replies.author.userId', 'name')
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Transform posts to include virtual fields
    const transformedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      category: post.category,
      tags: post.tags,
      status: post.status,
      views: post.views,
      likeCount: post.likes.length,
      replyCount: post.replies.length,
      replies: post.replies,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      lastActivity: post.lastActivity,
      timeAgo: getTimeAgo(post.lastActivity)
    }));

    const total = await ForumPost.countDocuments(filter);

    res.json({
      posts: transformedPosts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalPosts: total
    });

  } catch (error) {
    console.error('Get forum posts error:', error);
    res.status(500).json({ message: 'Server error fetching forum posts' });
  }
});

// @route   GET /api/forum/posts/:id
// @desc    Get single forum post with replies
// @access  Public
router.get('/posts/:id', [
  param('id').isMongoId().withMessage('Invalid post ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const post = await ForumPost.findById(req.params.id)
      .populate('author.userId', 'name')
      .populate('replies.author.userId', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    const transformedPost = {
      ...post.toObject(),
      likeCount: post.likes.length,
      replyCount: post.replies.length,
      timeAgo: getTimeAgo(post.createdAt)
    };

    res.json(transformedPost);

  } catch (error) {
    console.error('Get forum post error:', error);
    res.status(500).json({ message: 'Server error fetching post' });
  }
});

// @route   POST /api/forum/posts
// @desc    Create a new forum post
// @access  Private
router.post('/posts', auth, [
  body('title').trim().isLength({ min: 10, max: 200 }).withMessage('Title must be between 10-200 characters'),
  body('content').trim().isLength({ min: 20, max: 5000 }).withMessage('Content must be between 20-5000 characters'),
  body('category').isIn([
    'Engineering', 'Medical', 'Business', 'Arts', 'Science', 
    'Career Change', 'Career Choice', 'Job Search', 'Education', 
    'Technology', 'General'
  ]).withMessage('Invalid category'),
  body('tags').optional().isArray({ max: 5 }).withMessage('Maximum 5 tags allowed')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const postData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      author: {
        userId: req.user._id,
        name: req.user.name
      },
      tags: req.body.tags || []
    };

    const post = new ForumPost(postData);
    await post.save();

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// @route   PUT /api/forum/posts/:id
// @desc    Update forum post
// @access  Private (author only)
router.put('/posts/:id', auth, [
  param('id').isMongoId().withMessage('Invalid post ID'),
  body('title').optional().trim().isLength({ min: 10, max: 200 }).withMessage('Title must be between 10-200 characters'),
  body('content').optional().trim().isLength({ min: 20, max: 5000 }).withMessage('Content must be between 20-5000 characters'),
  body('category').optional().isIn([
    'Engineering', 'Medical', 'Business', 'Arts', 'Science', 
    'Career Change', 'Career Choice', 'Job Search', 'Education', 
    'Technology', 'General'
  ]).withMessage('Invalid category'),
  body('tags').optional().isArray({ max: 5 }).withMessage('Maximum 5 tags allowed')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns this post
    if (post.author.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Update fields
    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;
    if (req.body.category) post.category = req.body.category;
    if (req.body.tags) post.tags = req.body.tags;

    await post.save();

    res.json({
      message: 'Post updated successfully',
      post
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error updating post' });
  }
});

// @route   DELETE /api/forum/posts/:id
// @desc    Delete forum post
// @access  Private (author only)
router.delete('/posts/:id', auth, [
  param('id').isMongoId().withMessage('Invalid post ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns this post
    if (post.author.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await ForumPost.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
});

// @route   POST /api/forum/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/posts/:id/like', auth, [
  param('id').isMongoId().withMessage('Invalid post ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLikeIndex = post.likes.findIndex(
      like => like.userId.toString() === req.user._id.toString()
    );

    if (existingLikeIndex > -1) {
      // Unlike
      post.likes.splice(existingLikeIndex, 1);
      await post.save();
      
      res.json({
        message: 'Post unliked',
        liked: false,
        likeCount: post.likes.length
      });
    } else {
      // Like
      post.likes.push({ userId: req.user._id });
      await post.save();
      
      res.json({
        message: 'Post liked',
        liked: true,
        likeCount: post.likes.length
      });
    }

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error toggling like' });
  }
});

// @route   POST /api/forum/posts/:id/reply
// @desc    Reply to a forum post
// @access  Private
router.post('/posts/:id/reply', auth, [
  param('id').isMongoId().withMessage('Invalid post ID'),
  body('content').trim().isLength({ min: 10, max: 2000 }).withMessage('Reply must be between 10-2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = {
      author: {
        userId: req.user._id,
        name: req.user.name
      },
      content: req.body.content
    };

    post.replies.push(reply);
    post.lastActivity = new Date();
    await post.save();

    res.status(201).json({
      message: 'Reply added successfully',
      reply: post.replies[post.replies.length - 1]
    });

  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error adding reply' });
  }
});

// @route   GET /api/forum/categories
// @desc    Get forum categories with post counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await ForumPost.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoriesWithCounts = categories.map(cat => ({
      name: cat._id,
      count: cat.count
    }));

    res.json(categoriesWithCounts);

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// @route   GET /api/forum/stats
// @desc    Get forum statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await ForumPost.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalReplies: { $sum: { $size: '$replies' } },
          totalLikes: { $sum: { $size: '$likes' } }
        }
      }
    ]);

    const result = stats[0] || {
      totalPosts: 0,
      totalViews: 0,
      totalReplies: 0,
      totalLikes: 0
    };

    res.json(result);

  } catch (error) {
    console.error('Get forum stats error:', error);
    res.status(500).json({ message: 'Server error fetching forum stats' });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${days} days ago`;
  }
}

export default router;