import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Update user profile
router.put('/profile', authenticateUser, [
  body('name').optional().isLength({ min: 1 }).trim(),
  body('profile.interests').optional().isArray(),
  body('profile.academic.level').optional().isIn(['high-school', 'intermediate', 'undergraduate', 'postgraduate']),
  body('profile.academic.stream').optional().isString().trim(),
  body('profile.skills').optional().isArray(),
  body('profile.goals').optional().isArray(),
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

    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update user fields
    Object.keys(req.body).forEach(key => {
      if (key === 'profile') {
        user.profile = { ...user.profile, ...req.body.profile };
      } else {
        user[key] = req.body[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Complete onboarding
router.post('/complete-onboarding', authenticateUser, [
  body('interests').isArray().isLength({ min: 1 }),
  body('academic').isObject(),
  body('skills').isArray().isLength({ min: 1 }),
  body('goals').isArray().isLength({ min: 1 }),
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

    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { interests, academic, skills, goals } = req.body;

    user.profile.interests = interests;
    user.profile.academic = academic;
    user.profile.skills = skills;
    user.profile.goals = goals;
    user.onboardingCompleted = true;

    await user.save();

    logger.info(`User ${user.email} completed onboarding`);

    res.json({
      success: true,
      user,
      message: 'Onboarding completed successfully',
    });
  } catch (error) {
    logger.error('Complete onboarding error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;