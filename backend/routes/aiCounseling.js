import express from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import AICounselingService from '../services/AICounselingService.js';
import ChatSession from '../models/ChatSession.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET /api/ai-counseling/test
 * Test Google AI API connection
 */
router.get('/test', async (req, res) => {
  try {
    const testResult = await AICounselingService.testConnection();
    
    res.json({
      success: testResult.success,
      message: testResult.success ? 'Google AI API connection successful' : 'Google AI API connection failed',
      data: testResult,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error testing AI connection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test AI connection',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Validation middleware
const validateMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters'),
  body('sessionId')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Session ID must be between 1 and 100 characters')
];

/**
 * POST /api/ai-counseling/chat
 * Send a message to AI counselor and get response
 */
router.post('/chat', auth, validateMessage, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { message, sessionId } = req.body;
    const userId = req.user._id;

    // Generate session ID if not provided
    const currentSessionId = sessionId || `session_${userId}_${Date.now()}`;

    // Get or create chat session
    const chatSession = await ChatSession.findOrCreateSession(userId, currentSessionId);

    // Get user profile for context
    const user = await User.findById(userId).select('onboardingData profile');
    const userProfile = user ? {
      currentLevel: user.onboardingData?.currentLevel,
      careerStage: user.onboardingData?.careerStage,
      interests: user.onboardingData?.interests || [],
      goals: user.onboardingData?.goals || [],
      currentSkills: user.profile?.currentSkills || [],
      experience: user.profile?.experience || ''
    } : null;

    // Add user message to session
    await chatSession.addMessage('user', message);

    // Get conversation history for context
    const conversationHistory = chatSession.getRecentMessages(10);

    // Generate AI response
    const startTime = Date.now();
    const aiResponse = await AICounselingService.generateCounselingResponse(
      message,
      userProfile,
      conversationHistory
    );
    const responseTime = Date.now() - startTime;

    // Add AI response to session
    await chatSession.addMessage('bot', aiResponse.response, {
      responseTime,
      model: 'gemini-pro',
      success: aiResponse.success
    });

    res.json({
      success: true,
      data: {
        sessionId: currentSessionId,
        response: aiResponse.response,
        responseTime,
        messageCount: chatSession.messageCount
      }
    });

  } catch (error) {
    console.error('Error in AI counseling chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/ai-counseling/sessions
 * Get user's chat sessions
 */
router.get('/sessions', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20, offset = 0, status = 'active' } = req.query;

    const sessions = await ChatSession.find({ 
      userId, 
      status 
    })
    .select('sessionId title createdAt updatedAt lastMessageAt messageCount')
    .sort({ lastMessageAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset));

    const total = await ChatSession.countDocuments({ userId, status });

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat sessions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/ai-counseling/sessions/:sessionId
 * Get specific chat session with messages
 */
router.get('/sessions/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await ChatSession.findOne({
      sessionId,
      userId,
      status: { $ne: 'deleted' }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Error fetching chat session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/ai-counseling/sessions/:sessionId
 * Update chat session (title, archive, etc.)
 */
router.put('/sessions/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;
    const { title, status } = req.body;

    const session = await ChatSession.findOne({
      sessionId,
      userId,
      status: { $ne: 'deleted' }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    // Update allowed fields
    if (title !== undefined) session.title = title;
    if (status !== undefined && ['active', 'archived'].includes(status)) {
      session.status = status;
    }

    await session.save();

    res.json({
      success: true,
      data: session,
      message: 'Session updated successfully'
    });

  } catch (error) {
    console.error('Error updating chat session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update chat session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * DELETE /api/ai-counseling/sessions/:sessionId
 * Delete chat session
 */
router.delete('/sessions/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await ChatSession.findOne({
      sessionId,
      userId,
      status: { $ne: 'deleted' }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    session.status = 'deleted';
    await session.save();

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/ai-counseling/assessment/questions
 * Generate personalized assessment questions
 */
router.post('/assessment/questions', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user profile for context
    const user = await User.findById(userId).select('onboardingData profile');
    const userProfile = user ? {
      currentLevel: user.onboardingData?.currentLevel,
      careerStage: user.onboardingData?.careerStage,
      interests: user.onboardingData?.interests || [],
      goals: user.onboardingData?.goals || [],
      currentSkills: user.profile?.currentSkills || [],
      experience: user.profile?.experience || ''
    } : null;

    const result = await AICounselingService.generateAssessmentQuestions(userProfile);

    if (result.success) {
      res.json({
        success: true,
        data: {
          questions: result.questions
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to generate assessment questions',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error generating assessment questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate assessment questions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/ai-counseling/assessment/analyze
 * Analyze user assessment responses
 */
router.post('/assessment/analyze', auth, [
  body('responses').isArray().withMessage('Responses must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { responses } = req.body;
    const userId = req.user._id;

    // Get user profile for context
    const user = await User.findById(userId).select('onboardingData profile');
    const userProfile = user ? {
      currentLevel: user.onboardingData?.currentLevel,
      careerStage: user.onboardingData?.careerStage,
      interests: user.onboardingData?.interests || [],
      goals: user.onboardingData?.goals || [],
      currentSkills: user.profile?.currentSkills || [],
      experience: user.profile?.experience || ''
    } : null;

    const result = await AICounselingService.analyzeUserResponses(responses, userProfile);

    res.json({
      success: result.success,
      data: {
        analysis: result.analysis,
        timestamp: result.timestamp
      },
      error: result.error
    });

  } catch (error) {
    console.error('Error analyzing assessment responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze responses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/ai-counseling/stats
 * Get user's AI counseling usage statistics
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalSessions, totalMessages, activeSessions] = await Promise.all([
      ChatSession.countDocuments({ userId }),
      ChatSession.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: null, total: { $sum: { $size: '$messages' } } } }
      ]),
      ChatSession.countDocuments({ userId, status: 'active' })
    ]);

    const totalMessageCount = totalMessages[0]?.total || 0;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity = await ChatSession.countDocuments({
      userId,
      lastMessageAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalSessions,
        activeSessions,
        totalMessages: totalMessageCount,
        recentActivity,
        averageMessagesPerSession: totalSessions > 0 ? Math.round(totalMessageCount / totalSessions) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching AI counseling stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;