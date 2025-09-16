import express from 'express';
import Career from '../models/Career.js';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';
import { generateCareerRecommendations } from '../utils/aiService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get career recommendations for user
router.get('/recommendations', authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user || !user.onboardingCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete onboarding first',
      });
    }

    // Check if we have recent recommendations
    const recentRecommendations = user.careerRecommendations.filter(
      rec => new Date() - rec.generatedAt < 24 * 60 * 60 * 1000 // 24 hours
    );

    if (recentRecommendations.length > 0) {
      return res.json({
        success: true,
        recommendations: recentRecommendations,
        cached: true,
      });
    }

    // Generate new recommendations using AI
    const recommendations = await generateCareerRecommendations(user);

    // Save recommendations to user
    user.careerRecommendations = recommendations;
    await user.save();

    res.json({
      success: true,
      recommendations,
      cached: false,
    });
  } catch (error) {
    logger.error('Get career recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Get career details by ID
router.get('/:careerId', authenticateUser, async (req, res) => {
  try {
    const career = await Career.findById(req.params.careerId);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found',
      });
    }

    res.json({
      success: true,
      career,
    });
  } catch (error) {
    logger.error('Get career details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Search careers
router.get('/search/:query', authenticateUser, async (req, res) => {
  try {
    const { query } = req.params;
    const { category, industry, growthPotential } = req.query;

    let searchCriteria = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    };

    if (category) {
      searchCriteria.category = category;
    }

    if (industry) {
      searchCriteria.industry = industry;
    }

    if (growthPotential) {
      searchCriteria.growthPotential = growthPotential;
    }

    const careers = await Career.find(searchCriteria)
      .limit(20)
      .sort({ 'jobMarketData.demandLevel': -1 });

    res.json({
      success: true,
      careers,
    });
  } catch (error) {
    logger.error('Search careers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Get trending careers
router.get('/trending', authenticateUser, async (req, res) => {
  try {
    const trendingCareers = await Career.find({
      'jobMarketData.trendDirection': 'growing',
      'jobMarketData.demandLevel': { $in: ['high', 'very-high'] },
    })
      .limit(10)
      .sort({ 'jobMarketData.openings': -1 });

    res.json({
      success: true,
      careers: trendingCareers,
    });
  } catch (error) {
    logger.error('Get trending careers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;