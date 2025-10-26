import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Mentor from '../models/Mentor.js';
import MentorSession from '../models/MentorSession.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/mentors
// @desc    Get all mentors with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      expertise,
      location,
      availability,
      minRating,
      maxPrice,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { expertise: { $in: [new RegExp(search, 'i')] } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    if (expertise) {
      filter.expertise = { $in: expertise.split(',') };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (availability) {
      filter.availability = availability;
    }

    if (minRating) {
      filter['rating.average'] = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      filter['price.amount'] = { $lte: parseFloat(maxPrice) };
    }

    // Execute query with pagination
    const mentors = await Mentor.find(filter)
      .populate('userId', 'name email')
      .sort({ 'rating.average': -1, totalSessions: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Mentor.countDocuments(filter);

    res.json({
      mentors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalMentors: total
    });

  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ message: 'Server error fetching mentors' });
  }
});

// @route   GET /api/mentors/:id
// @desc    Get mentor by ID
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid mentor ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const mentor = await Mentor.findById(req.params.id)
      .populate('userId', 'name email createdAt');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json(mentor);

  } catch (error) {
    console.error('Get mentor error:', error);
    res.status(500).json({ message: 'Server error fetching mentor' });
  }
});

// @route   POST /api/mentors
// @desc    Add a new mentor
// @access  Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('experience').notEmpty().withMessage('Experience is required'),
  body('expertise').isArray({ min: 1 }).withMessage('At least one expertise is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price.amount').isNumeric().withMessage('Price amount must be a number'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check if user is already registered as a mentor
    const existingMentor = await Mentor.findOne({ userId: req.user._id });
    if (existingMentor) {
      return res.status(400).json({ 
        message: 'You are already registered as a mentor' 
      });
    }

    // Create new mentor
    const mentorData = {
      userId: req.user._id,
      name: req.body.name,
      title: req.body.title,
      company: req.body.company,
      bio: req.body.bio || '',
      experience: req.body.experience,
      expertise: req.body.expertise,
      languages: req.body.languages || ['English'],
      location: req.body.location,
      availability: req.body.availability || 'Available',
      price: {
        amount: req.body.price.amount,
        currency: req.body.price.currency || 'INR'
      },
      profileImage: req.body.profileImage || '',
      schedule: {
        timezone: req.body.schedule?.timezone || 'Asia/Kolkata',
        availableSlots: req.body.schedule?.availableSlots || []
      },
      isVerified: false // New mentors need verification
    };

    const mentor = new Mentor(mentorData);
    await mentor.save();

    // Populate userId field for response
    await mentor.populate('userId', 'name email');

    res.status(201).json({
      message: 'Mentor added successfully',
      mentor
    });

  } catch (error) {
    console.error('Add mentor error:', error);
    res.status(500).json({ message: 'Server error adding mentor' });
  }
});

// @route   POST /api/mentors/register
// @desc    Register as a mentor
// @access  Private
router.post('/register', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('experience').notEmpty().withMessage('Experience is required'),
  body('expertise').isArray({ min: 1 }).withMessage('At least one expertise is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('price.amount').isNumeric().withMessage('Price amount must be a number'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check if user is already a mentor
    const existingMentor = await Mentor.findOne({ userId: req.user._id });
    if (existingMentor) {
      return res.status(400).json({ message: 'User is already registered as a mentor' });
    }

    const mentorData = {
      userId: req.user._id,
      name: req.user.name,
      ...req.body
    };

    const mentor = new Mentor(mentorData);
    await mentor.save();

    res.status(201).json({
      message: 'Successfully registered as mentor',
      mentor
    });

  } catch (error) {
    console.error('Register mentor error:', error);
    res.status(500).json({ message: 'Server error registering mentor' });
  }
});

// @route   PUT /api/mentors/:id
// @desc    Update mentor profile
// @access  Private (mentor only)
router.put('/:id', auth, [
  param('id').isMongoId().withMessage('Invalid mentor ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('company').optional().notEmpty().withMessage('Company cannot be empty'),
  body('experience').optional().notEmpty().withMessage('Experience cannot be empty'),
  body('expertise').optional().isArray({ min: 1 }).withMessage('At least one expertise is required'),
  body('location').optional().notEmpty().withMessage('Location cannot be empty'),
  body('price.amount').optional().isNumeric().withMessage('Price amount must be a number'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if user owns this mentor profile
    if (mentor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this mentor profile' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        mentor[key] = req.body[key];
      }
    });

    await mentor.save();

    res.json({
      message: 'Mentor profile updated successfully',
      mentor
    });

  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({ message: 'Server error updating mentor' });
  }
});

// @route   POST /api/mentors/:id/book
// @desc    Book a session with mentor
// @access  Private
router.post('/:id/book', auth, [
  param('id').isMongoId().withMessage('Invalid mentor ID'),
  body('sessionDate').isISO8601().withMessage('Valid session date is required'),
  body('duration').optional().isInt({ min: 30, max: 180 }).withMessage('Duration must be between 30-180 minutes'),
  body('topics').optional().isArray().withMessage('Topics must be an array'),
  body('sessionType').optional().isIn(['video-call', 'phone-call', 'chat', 'in-person']).withMessage('Invalid session type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    if (mentor.availability !== 'Available') {
      return res.status(400).json({ message: 'Mentor is not available for booking' });
    }

    // Check if the session date is in the future (allow booking for next hour)
    const sessionDate = new Date(req.body.sessionDate);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    if (sessionDate < oneHourFromNow) {
      return res.status(400).json({ message: 'Session must be booked at least 1 hour in advance' });
    }

    // Check for conflicts (existing sessions within 1 hour buffer)
    const conflictStart = new Date(sessionDate.getTime() - 60 * 60 * 1000); // 1 hour before
    const conflictEnd = new Date(sessionDate.getTime() + 60 * 60 * 1000);   // 1 hour after
    
    const conflictingSessions = await MentorSession.find({
      mentor: mentor._id,
      sessionDate: {
        $gte: conflictStart,
        $lte: conflictEnd
      },
      status: { $in: ['scheduled', 'ongoing'] }
    });

    // Allow booking if no conflicts found
    if (conflictingSessions.length > 0) {
      return res.status(400).json({ 
        message: 'Mentor has a conflicting session. Please choose a different time.',
        conflictCount: conflictingSessions.length
      });
    }

    const sessionData = {
      mentor: mentor._id,
      student: req.user._id,
      sessionDate: req.body.sessionDate,
      duration: req.body.duration || 60,
      topics: req.body.topics || [],
      sessionType: req.body.sessionType || 'video-call',
      payment: {
        amount: mentor.price.amount,
        currency: mentor.price.currency
      }
    };

    const session = new MentorSession(sessionData);
    await session.save();

    // Generate meeting link for video calls (mock implementation)
    if (session.sessionType === 'video-call') {
      session.meetingLink = `https://meet.careerpath.com/session/${session._id}`;
      await session.save();
    }

    // Update mentor's total sessions
    mentor.totalSessions += 1;
    await mentor.save();

    res.status(201).json({
      message: 'Session booked successfully',
      session
    });

  } catch (error) {
    console.error('Book session error:', error);
    res.status(500).json({ message: 'Server error booking session' });
  }
});

// @route   GET /api/mentors/sessions/my
// @desc    Get user's mentor sessions
// @access  Private
router.get('/sessions/my', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { student: req.user._id };
    if (status) {
      filter.status = status;
    }

    const sessions = await MentorSession.find(filter)
      .populate('mentor', 'name title company price rating')
      .sort({ sessionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MentorSession.countDocuments(filter);

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalSessions: total
    });

  } catch (error) {
    console.error('Get my sessions error:', error);
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
});

// @route   PUT /api/mentors/sessions/:sessionId/feedback
// @desc    Submit feedback for a session
// @access  Private
router.put('/sessions/:sessionId/feedback', auth, [
  param('sessionId').isMongoId().withMessage('Invalid session ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const session = await MentorSession.findById(req.params.sessionId).populate('mentor');
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is part of this session
    const isStudent = session.student.toString() === req.user._id.toString();
    const isMentor = session.mentor.userId.toString() === req.user._id.toString();
    
    if (!isStudent && !isMentor) {
      return res.status(403).json({ message: 'Not authorized to submit feedback for this session' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Can only submit feedback for completed sessions' });
    }

    // Update feedback based on user role
    if (isStudent) {
      session.feedback.studentRating = req.body.rating;
      session.feedback.studentComment = req.body.comment;
    } else {
      session.feedback.mentorRating = req.body.rating;
      session.feedback.mentorComment = req.body.comment;
    }

    await session.save();

    // Update mentor's rating if student submitted feedback
    if (isStudent) {
      const mentor = await Mentor.findById(session.mentor._id);
      const allRatedSessions = await MentorSession.find({
        mentor: mentor._id,
        'feedback.studentRating': { $exists: true }
      });

      if (allRatedSessions.length > 0) {
        const totalRating = allRatedSessions.reduce((sum, s) => sum + s.feedback.studentRating, 0);
        mentor.rating.average = (totalRating / allRatedSessions.length).toFixed(1);
        mentor.rating.count = allRatedSessions.length;
        await mentor.save();
      }
    }

    res.json({
      message: 'Feedback submitted successfully',
      session
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error submitting feedback' });
  }
});

export default router;