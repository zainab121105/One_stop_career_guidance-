import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';
import { getSkillRecommendations } from '../utils/skillMatcher.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get skill recommendations based on career goals
router.get('/recommendations', authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user || !user.onboardingCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete onboarding first',
      });
    }

    const recommendations = await getSkillRecommendations(user);

    res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    logger.error('Get skill recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Update skill progress
router.post('/progress', authenticateUser, [
  body('skillName').isString().notEmpty(),
  body('currentLevel').isNumeric().isFloat({ min: 0, max: 100 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { skillName, currentLevel } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find existing skill progress or create new
    let skillProgress = user.learningPath.skillProgress.find(
      sp => sp.skillName === skillName
    );

    if (skillProgress) {
      skillProgress.currentLevel = currentLevel;
      skillProgress.lastUpdated = new Date();
    } else {
      user.learningPath.skillProgress.push({
        skillName,
        currentLevel,
        targetLevel: 80, // Default target
        lastUpdated: new Date(),
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Skill progress updated successfully',
    });
  } catch (error) {
    logger.error('Update skill progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Get skill gap analysis
router.get('/gap-analysis', authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user || !user.onboardingCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete onboarding first',
      });
    }

    // Analyze skill gaps based on career recommendations
    const analysis = await analyzeSkillGaps(user);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    logger.error('Get skill gap analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Mock function for skill gap analysis
async function analyzeSkillGaps(user) {
  // This would integrate with AI services in production
  return {
    criticalGaps: [
      {
        skill: 'Python Programming',
        currentLevel: 30,
        requiredLevel: 75,
        importance: 'high',
        estimatedTime: '3 months',
      },
      {
        skill: 'Machine Learning',
        currentLevel: 10,
        requiredLevel: 65,
        importance: 'medium',
        estimatedTime: '6 months',
      }
    ],
    strengths: [
      {
        skill: 'Problem Solving',
        level: 85,
        relevance: 'high',
      }
    ],
    learningPath: [
      {
        skill: 'Python Programming',
        resources: [
          'Python for Everybody Specialization - Coursera',
          'Automate the Boring Stuff with Python',
        ],
        estimatedDuration: '8-12 weeks',
      }
    ]
  };
}

export default router;