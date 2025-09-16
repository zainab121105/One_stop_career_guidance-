import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';
import { processAssessmentResults } from '../utils/assessmentProcessor.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Submit assessment results
router.post('/submit', authenticateUser, [
  body('category').isIn(['aptitude', 'personality', 'interest', 'skill']),
  body('answers').isArray().isLength({ min: 1 }),
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

    const { category, answers } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Process assessment results
    const results = await processAssessmentResults(category, answers, user);

    // Save results to user
    user.assessmentResults.push(results);
    await user.save();

    logger.info(`Assessment completed: ${category} for user ${user.email}`);

    res.json({
      success: true,
      results,
      message: 'Assessment submitted successfully',
    });
  } catch (error) {
    logger.error('Submit assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Get assessment history
router.get('/history', authenticateUser, async (req, res) => {
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
      assessments: user.assessmentResults,
    });
  } catch (error) {
    logger.error('Get assessment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Get assessment questions
router.get('/questions/:category', authenticateUser, async (req, res) => {
  try {
    const { category } = req.params;
    
    // In a real app, you'd fetch questions from a database
    // For now, return mock questions based on category
    const questions = getQuestionsByCategory(category);

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    logger.error('Get assessment questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Mock function to get questions by category
function getQuestionsByCategory(category) {
  const questionSets = {
    aptitude: [
      {
        id: 1,
        text: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
        options: ["100 minutes", "1 minute", "5 minutes", "500 minutes"],
        type: "multiple-choice"
      },
      {
        id: 2,
        text: "Which number comes next in the sequence: 2, 6, 12, 20, 30, ?",
        options: ["42", "40", "38", "36"],
        type: "multiple-choice"
      }
    ],
    personality: [
      {
        id: 1,
        text: "I enjoy working in teams rather than alone",
        type: "likert",
        scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      },
      {
        id: 2,
        text: "I prefer to plan my work in advance rather than being spontaneous",
        type: "likert",
        scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      }
    ],
    interest: [
      {
        id: 1,
        text: "Rate your interest in analyzing data and finding patterns",
        type: "likert",
        scale: ["Not Interested", "Slightly Interested", "Moderately Interested", "Very Interested", "Extremely Interested"]
      },
      {
        id: 2,
        text: "Rate your interest in creating visual designs and artwork",
        type: "likert",
        scale: ["Not Interested", "Slightly Interested", "Moderately Interested", "Very Interested", "Extremely Interested"]
      }
    ]
  };

  return questionSets[category] || [];
}

export default router;