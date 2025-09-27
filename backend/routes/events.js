import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Event from '../models/Event.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      type,
      status = 'published',
      upcoming = 'true',
      search,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { status };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter for upcoming events
    if (upcoming === 'true') {
      filter['schedule.startDate'] = { $gte: new Date() };
    }

    const events = await Event.find(filter)
      .populate('organizer.userId', 'name email')
      .sort({ 'schedule.startDate': 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Transform events to include virtual fields
    const transformedEvents = events.map(event => ({
      ...event.toObject(),
      availableSpots: event.availableSpots,
      registrationOpen: event.registrationOpen,
      timeUntilEvent: getTimeUntilEvent(event.schedule.startDate)
    }));

    const total = await Event.countDocuments(filter);

    res.json({
      events: transformedEvents,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalEvents: total
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid event ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id)
      .populate('organizer.userId', 'name email')
      .populate('attendees.userId', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const transformedEvent = {
      ...event.toObject(),
      availableSpots: event.availableSpots,
      registrationOpen: event.registrationOpen,
      timeUntilEvent: getTimeUntilEvent(event.schedule.startDate)
    };

    res.json(transformedEvent);

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error fetching event' });
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5-100 characters'),
  body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20-2000 characters'),
  body('type').isIn(['Online', 'Offline', 'Hybrid']).withMessage('Invalid event type'),
  body('category').isIn([
    'Career Workshops', 'Industry Panels', 'Skill Development',
    'Networking Events', 'Mock Interviews', 'Webinars', 'Conferences'
  ]).withMessage('Invalid category'),
  body('schedule.startDate').isISO8601().withMessage('Valid start date is required'),
  body('schedule.startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required (HH:MM format)'),
  body('capacity.maxAttendees').isInt({ min: 1 }).withMessage('Max attendees must be at least 1'),
  body('speakers').isArray({ min: 1 }).withMessage('At least one speaker is required'),
  body('registration.startDate').isISO8601().withMessage('Registration start date is required'),
  body('registration.deadline').isISO8601().withMessage('Registration deadline is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Validate start date is in the future
    const startDate = new Date(req.body.schedule.startDate);
    if (startDate <= new Date()) {
      return res.status(400).json({ message: 'Event start date must be in the future' });
    }

    const eventData = {
      ...req.body,
      organizer: {
        userId: req.user._id,
        name: req.user.name,
        organization: req.body.organizer?.organization || ''
      },
      status: 'published'
    };

    const event = new Event(eventData);
    await event.save();

    // Log the saved event data for debugging
    console.log('Event created with registration data:', {
      registrationStartDate: event.registration.startDate,
      registrationDeadline: event.registration.deadline,
      registrationOpen: event.registrationOpen
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error creating event' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (organizer only)
router.put('/:id', auth, [
  param('id').isMongoId().withMessage('Invalid event ID'),
  body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5-100 characters'),
  body('description').optional().trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20-2000 characters'),
  body('type').optional().isIn(['Online', 'Offline', 'Hybrid']).withMessage('Invalid event type'),
  body('category').optional().isIn([
    'Career Workshops', 'Industry Panels', 'Skill Development',
    'Networking Events', 'Mock Interviews', 'Webinars', 'Conferences'
  ]).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user owns this event
    if (event.organizer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        if (key === 'schedule' || key === 'capacity' || key === 'registration' || key === 'location') {
          // Handle nested objects
          Object.keys(req.body[key]).forEach(nestedKey => {
            if (req.body[key][nestedKey] !== undefined) {
              event[key][nestedKey] = req.body[key][nestedKey];
            }
          });
        } else {
          event[key] = req.body[key];
        }
      }
    });

    await event.save();

    res.json({
      message: 'Event updated successfully',
      event
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error updating event' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (organizer only)
router.delete('/:id', auth, [
  param('id').isMongoId().withMessage('Invalid event ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user owns this event
    if (event.organizer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Can't delete event if it has attendees
    if (event.attendees.length > 0) {
      return res.status(400).json({ message: 'Cannot delete event with registered attendees' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', auth, [
  param('id').isMongoId().withMessage('Invalid event ID'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if registration is open
    if (!event.registrationOpen) {
      return res.status(400).json({ message: 'Registration is closed for this event' });
    }

    // Check if user is already registered
    const existingRegistration = event.attendees.find(
      attendee => attendee.userId.toString() === req.user._id.toString()
    );

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Add attendee with detailed information
    event.attendees.push({
      userId: req.user._id,
      name: req.body.name || req.user.name,
      email: req.body.email || req.user.email,
      phone: req.body.phone || '',
      organization: req.body.organization || '',
      jobTitle: req.body.jobTitle || '',
      city: req.body.city || '',
      experience: req.body.experience || '',
      expectations: req.body.expectations || '',
      dietaryRestrictions: req.body.dietaryRestrictions || '',
      emergencyContact: req.body.emergencyContact || '',
      emergencyPhone: req.body.emergencyPhone || '',
      paymentStatus: event.registration?.fee?.amount > 0 ? 'pending' : 'paid'
    });

    event.capacity.currentAttendees = event.attendees.length;
    await event.save();

    res.json({
      message: 'Successfully registered for event',
      event: {
        id: event._id,
        title: event.title,
        startDate: event.schedule.startDate,
        startTime: event.schedule.startTime
      }
    });

  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ message: 'Server error registering for event' });
  }
});

// @route   DELETE /api/events/:id/register
// @desc    Unregister from an event
// @access  Private
router.delete('/:id/register', auth, [
  param('id').isMongoId().withMessage('Invalid event ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find and remove attendee
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.userId.toString() === req.user._id.toString()
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    event.attendees.splice(attendeeIndex, 1);
    event.capacity.currentAttendees = event.attendees.length;
    await event.save();

    res.json({ message: 'Successfully unregistered from event' });

  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({ message: 'Server error unregistering from event' });
  }
});

// @route   GET /api/events/my/registered
// @desc    Get events user is registered for
// @access  Private
router.get('/my/registered', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {
      'attendees.userId': req.user._id
    };

    if (status === 'upcoming') {
      filter['schedule.startDate'] = { $gte: new Date() };
    } else if (status === 'past') {
      filter['schedule.startDate'] = { $lt: new Date() };
    }

    const events = await Event.find(filter)
      .populate('organizer.userId', 'name')
      .sort({ 'schedule.startDate': 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalEvents: total
    });

  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ message: 'Server error fetching registered events' });
  }
});

// @route   GET /api/events/categories
// @desc    Get event categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Event.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoriesWithCounts = categories.map(cat => ({
      name: cat._id,
      count: cat.count
    }));

    res.json(categoriesWithCounts);

  } catch (error) {
    console.error('Get event categories error:', error);
    res.status(500).json({ message: 'Server error fetching event categories' });
  }
});



// Helper function to calculate time until event
function getTimeUntilEvent(eventDate) {
  const now = new Date();
  const event = new Date(eventDate);
  const diff = event - now;
  
  if (diff < 0) {
    return 'Event has passed';
  }
  
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  
  if (days > 0) {
    return `${days} days`;
  } else if (hours > 0) {
    return `${hours} hours`;
  } else {
    return 'Starting soon';
  }
}

export default router;