import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/user/onboarding
// @desc    Save user onboarding data
// @access  Private
router.post('/onboarding', auth, [
  body('currentLevel').isIn(['high-school', 'college', 'graduate', 'professional']).withMessage('Invalid current level'),
  body('careerStage').isIn(['exploring', 'deciding', 'switching', 'advancing']).withMessage('Invalid career stage'),
  body('interests').isArray({ min: 1 }).withMessage('At least one interest is required'),
  body('goals').isArray({ min: 1 }).withMessage('At least one goal is required'),
  body('preferredLearningStyle').isIn(['visual', 'hands-on', 'reading', 'interactive']).withMessage('Invalid learning style'),
  body('timeCommitment').isIn(['1-2-hours', '3-5-hours', '6-10-hours', '10-plus-hours']).withMessage('Invalid time commitment')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const user = req.user;
    const onboardingData = req.body;

    // Update user onboarding data
    user.onboardingData = onboardingData;
    user.onboardingCompleted = true;

    // Add onboarding completion badge
    if (!user.badges.some(badge => badge.name === 'Onboarding Complete')) {
      user.badges.push({
        name: 'Onboarding Complete',
        description: 'Successfully completed the career assessment',
        icon: 'target'
      });
      user.stats.totalBadges += 1;
    }

    await user.save();

    // Log activity
    await Activity.create({
      userId: user._id,
      type: 'onboarding_completed',
      title: 'Completed onboarding',
      description: 'Finished career assessment and preferences setup',
      points: 50
    });

    res.json({
      message: 'Onboarding completed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        onboardingData: user.onboardingData
      }
    });

  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ message: 'Server error during onboarding' });
  }
});

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      completedCourses: user.stats.completedCourses || 0,
      totalBadges: user.stats.totalBadges || user.badges.length,
      studyHours: user.stats.studyHours || 0,
      currentStreak: user.stats.currentStreak || 0
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

// @route   GET /api/user/activity
// @desc    Get user recent activity
// @access  Private
router.get('/activity', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('type title description createdAt points');

    const formattedActivities = activities.map(activity => ({
      type: activity.type,
      title: activity.title,
      description: activity.description,
      time: activity.createdAt.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      points: activity.points
    }));

    res.json(formattedActivities);

  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error fetching activity' });
  }
});

// @route   GET /api/user/recommendations
// @desc    Get AI-powered career recommendations
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Mock recommendations based on onboarding data
    // In a real app, this would be powered by AI/ML algorithms
    let recommendations = [];
    
    if (user.onboardingCompleted && user.onboardingData) {
      const { interests, goals, currentLevel } = user.onboardingData;
      
      // Generate mock recommendations based on interests
      if (interests.includes('technology')) {
        recommendations.push({
          title: 'Software Developer',
          description: 'Build applications and systems using various programming languages',
          matchPercentage: 95,
          averageSalary: '$75,000 - $120,000',
          growthOutlook: 'Excellent'
        });
        
        recommendations.push({
          title: 'Data Scientist',
          description: 'Analyze complex data to help organizations make informed decisions',
          matchPercentage: 88,
          averageSalary: '$85,000 - $140,000',
          growthOutlook: 'Excellent'
        });
      }
      
      if (interests.includes('creative')) {
        recommendations.push({
          title: 'UX/UI Designer',
          description: 'Design user-friendly interfaces and experiences for digital products',
          matchPercentage: 92,
          averageSalary: '$65,000 - $110,000',
          growthOutlook: 'Very Good'
        });
      }
      
      if (interests.includes('business')) {
        recommendations.push({
          title: 'Product Manager',
          description: 'Guide product development from conception to launch',
          matchPercentage: 87,
          averageSalary: '$90,000 - $150,000',
          growthOutlook: 'Excellent'
        });
      }
      
      if (interests.includes('healthcare')) {
        recommendations.push({
          title: 'Healthcare Data Analyst',
          description: 'Use data to improve healthcare outcomes and efficiency',
          matchPercentage: 85,
          averageSalary: '$60,000 - $90,000',
          growthOutlook: 'Very Good'
        });
      }
    }

    // If no specific recommendations, provide general ones
    if (recommendations.length === 0) {
      recommendations = [
        {
          title: 'Complete Your Assessment',
          description: 'Take our detailed career assessment to get personalized recommendations',
          matchPercentage: 0,
          averageSalary: 'Varies',
          growthOutlook: 'Complete assessment to see recommendations'
        }
      ];
    }

    res.json(recommendations.slice(0, 3)); // Return top 3 recommendations

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error fetching recommendations' });
  }
});

// @route   GET /api/user/badges
// @desc    Get user badges
// @access  Private
router.get('/badges', auth, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      badges: user.badges,
      totalBadges: user.badges.length
    });

  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ message: 'Server error fetching badges' });
  }
});

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, [
  body('emailNotifications').optional().isBoolean().withMessage('Email notifications must be a boolean'),
  body('pushNotifications').optional().isBoolean().withMessage('Push notifications must be a boolean'),
  body('weeklyReport').optional().isBoolean().withMessage('Weekly report must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const user = req.user;
    const preferences = req.body;

    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error updating preferences' });
  }
});

export default router;