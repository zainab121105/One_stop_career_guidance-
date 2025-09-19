import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import CareerRoadmap from '../models/CareerRoadmap.js';
import RoadmapGenerationService from '../services/RoadmapGenerationService.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const roadmapService = new RoadmapGenerationService();

// @route   POST /api/roadmap/generate
// @desc    Generate a new career roadmap for the authenticated user
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Check if user has completed onboarding
    if (!user.onboardingCompleted || !user.onboardingData) {
      return res.status(400).json({
        message: 'Please complete your onboarding assessment first',
        code: 'ONBOARDING_REQUIRED'
      });
    }

    // Generate roadmap
    const roadmap = await roadmapService.generateRoadmap(user);

    res.status(201).json({
      message: 'Career roadmap generated successfully',
      roadmap: {
        id: roadmap._id,
        title: roadmap.title,
        description: roadmap.description,
        primaryCareerPath: roadmap.primaryCareerPath,
        alternativeCareerPaths: roadmap.alternativeCareerPaths,
        phases: roadmap.phases,
        matchScore: roadmap.matchScore,
        personalizedRecommendations: roadmap.personalizedRecommendations,
        nextSteps: roadmap.nextSteps,
        overallProgress: roadmap.overallProgress,
        createdAt: roadmap.createdAt
      }
    });

  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({ 
      message: 'Failed to generate career roadmap',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/roadmap
// @desc    Get user's active roadmap
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const roadmap = await CareerRoadmap.findOne({
      userId: req.user._id,
      status: 'active'
    }).sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({
        message: 'No active roadmap found',
        code: 'NO_ROADMAP'
      });
    }

    // Update access count and last accessed
    roadmap.accessCount += 1;
    roadmap.lastAccessed = new Date();
    await roadmap.save();

    res.json({
      roadmap: {
        id: roadmap._id,
        title: roadmap.title,
        description: roadmap.description,
        primaryCareerPath: roadmap.primaryCareerPath,
        alternativeCareerPaths: roadmap.alternativeCareerPaths,
        phases: roadmap.phases,
        matchScore: roadmap.matchScore,
        personalizedRecommendations: roadmap.personalizedRecommendations,
        nextSteps: roadmap.nextSteps,
        overallProgress: roadmap.overallProgress,
        version: roadmap.version,
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt
      }
    });

  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ message: 'Server error fetching roadmap' });
  }
});

// @route   GET /api/roadmap/all
// @desc    Get all user roadmaps (including archived)
// @access  Private
router.get('/all', auth, [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const roadmaps = await CareerRoadmap.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title description status version matchScore overallProgress createdAt updatedAt');

    const total = await CareerRoadmap.countDocuments({ userId: req.user._id });

    res.json({
      roadmaps,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get all roadmaps error:', error);
    res.status(500).json({ message: 'Server error fetching roadmaps' });
  }
});

// @route   PUT /api/roadmap/:id/milestone/:phaseId/:milestoneId
// @desc    Update milestone completion status
// @access  Private
router.put('/:id/milestone/:phaseId/:milestoneId', auth, [
  param('id').isMongoId().withMessage('Invalid roadmap ID'),
  param('phaseId').notEmpty().withMessage('Phase ID is required'),
  param('milestoneId').notEmpty().withMessage('Milestone ID is required'),
  body('completed').isBoolean().withMessage('Completed must be a boolean'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id, phaseId, milestoneId } = req.params;
    const { completed, notes } = req.body;

    // Verify roadmap belongs to user
    const roadmap = await CareerRoadmap.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!roadmap) {
      return res.status(404).json({
        message: 'Roadmap not found',
        code: 'ROADMAP_NOT_FOUND'
      });
    }

    // Update milestone
    const updatedRoadmap = await roadmapService.updateMilestoneProgress(
      id, phaseId, milestoneId, completed, notes
    );

    res.json({
      message: 'Milestone updated successfully',
      overallProgress: updatedRoadmap.overallProgress,
      milestone: {
        phaseId,
        milestoneId,
        completed,
        notes
      }
    });

  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error updating milestone'
    });
  }
});

// @route   POST /api/roadmap/regenerate
// @desc    Regenerate roadmap with updated user profile
// @access  Private
router.post('/regenerate', auth, [
  body('reason').optional().isString().withMessage('Reason must be a string')
], async (req, res) => {
  try {
    const { reason } = req.body;
    
    const roadmap = await roadmapService.regenerateRoadmap(
      req.user._id, 
      reason || 'User requested regeneration'
    );

    res.json({
      message: 'Roadmap regenerated successfully',
      roadmap: {
        id: roadmap._id,
        title: roadmap.title,
        description: roadmap.description,
        primaryCareerPath: roadmap.primaryCareerPath,
        alternativeCareerPaths: roadmap.alternativeCareerPaths,
        phases: roadmap.phases,
        matchScore: roadmap.matchScore,
        personalizedRecommendations: roadmap.personalizedRecommendations,
        nextSteps: roadmap.nextSteps,
        overallProgress: roadmap.overallProgress,
        version: roadmap.version,
        createdAt: roadmap.createdAt
      }
    });

  } catch (error) {
    console.error('Regenerate roadmap error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error regenerating roadmap'
    });
  }
});

// @route   GET /api/roadmap/:id
// @desc    Get specific roadmap by ID
// @access  Private
router.get('/:id', auth, [
  param('id').isMongoId().withMessage('Invalid roadmap ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const roadmap = await CareerRoadmap.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!roadmap) {
      return res.status(404).json({
        message: 'Roadmap not found',
        code: 'ROADMAP_NOT_FOUND'
      });
    }

    // Update access tracking
    roadmap.accessCount += 1;
    roadmap.lastAccessed = new Date();
    await roadmap.save();

    res.json({
      roadmap: {
        id: roadmap._id,
        title: roadmap.title,
        description: roadmap.description,
        primaryCareerPath: roadmap.primaryCareerPath,
        alternativeCareerPaths: roadmap.alternativeCareerPaths,
        phases: roadmap.phases,
        matchScore: roadmap.matchScore,
        personalizedRecommendations: roadmap.personalizedRecommendations,
        nextSteps: roadmap.nextSteps,
        overallProgress: roadmap.overallProgress,
        version: roadmap.version,
        status: roadmap.status,
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt
      }
    });

  } catch (error) {
    console.error('Get roadmap by ID error:', error);
    res.status(500).json({ message: 'Server error fetching roadmap' });
  }
});

// @route   DELETE /api/roadmap/:id
// @desc    Archive a roadmap (soft delete)
// @access  Private
router.delete('/:id', auth, [
  param('id').isMongoId().withMessage('Invalid roadmap ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const roadmap = await CareerRoadmap.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      { status: 'archived' },
      { new: true }
    );

    if (!roadmap) {
      return res.status(404).json({
        message: 'Roadmap not found',
        code: 'ROADMAP_NOT_FOUND'
      });
    }

    res.json({
      message: 'Roadmap archived successfully',
      roadmapId: roadmap._id
    });

  } catch (error) {
    console.error('Archive roadmap error:', error);
    res.status(500).json({ message: 'Server error archiving roadmap' });
  }
});

// @route   GET /api/roadmap/analytics/progress
// @desc    Get detailed analytics about user's roadmap progress
// @access  Private
router.get('/analytics/progress', auth, async (req, res) => {
  try {
    const analytics = await roadmapService.getRoadmapAnalytics(req.user._id);

    res.json({
      analytics: {
        ...analytics,
        userId: req.user._id,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// @route   GET /api/roadmap/suggestions/next-steps
// @desc    Get AI-powered suggestions for next steps
// @access  Private
router.get('/suggestions/next-steps', auth, async (req, res) => {
  try {
    const roadmap = await CareerRoadmap.findOne({
      userId: req.user._id,
      status: 'active'
    });

    if (!roadmap) {
      return res.status(404).json({
        message: 'No active roadmap found',
        code: 'NO_ROADMAP'
      });
    }

    // Find next recommended milestones
    const nextMilestones = [];
    
    for (const phase of roadmap.phases) {
      const incompleteMilestones = phase.milestones
        .filter(m => !m.completed)
        .sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

      if (incompleteMilestones.length > 0) {
        nextMilestones.push({
          phaseTitle: phase.title,
          milestone: incompleteMilestones[0],
          reason: `Next high-priority milestone in ${phase.title}`
        });
      }

      if (nextMilestones.length >= 3) break; // Limit to 3 suggestions
    }

    res.json({
      suggestions: {
        nextMilestones,
        recommendations: roadmap.personalizedRecommendations.slice(0, 3),
        nextSteps: roadmap.nextSteps.slice(0, 3)
      }
    });

  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error fetching suggestions' });
  }
});

// @route   POST /api/roadmap/:id/feedback
// @desc    Submit feedback about roadmap quality
// @access  Private
router.post('/:id/feedback', auth, [
  param('id').isMongoId().withMessage('Invalid roadmap ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().isString().withMessage('Feedback must be a string'),
  body('categories').optional().isArray().withMessage('Categories must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { rating, feedback, categories } = req.body;

    const roadmap = await CareerRoadmap.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!roadmap) {
      return res.status(404).json({
        message: 'Roadmap not found',
        code: 'ROADMAP_NOT_FOUND'
      });
    }

    // Add feedback to roadmap (you might want to create a separate Feedback model)
    roadmap.feedback = {
      rating,
      feedback,
      categories: categories || [],
      submittedAt: new Date()
    };

    await roadmap.save();

    res.json({
      message: 'Feedback submitted successfully',
      feedbackId: roadmap._id
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error submitting feedback' });
  }
});

export default router;