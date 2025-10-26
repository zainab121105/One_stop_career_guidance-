import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid'],
    required: [true, 'Event type is required']
  },
  category: {
    type: String,
    enum: [
      'Career Workshops',
      'Industry Panels',
      'Skill Development',
      'Networking Events',
      'Mock Interviews',
      'Webinars',
      'Conferences'
    ],
    required: [true, 'Category is required']
  },
  organizer: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    organization: String
  },
  speakers: [{
    name: {
      type: String,
      required: true
    },
    title: String,
    company: String,
    bio: String,
    image: String
  }],
  schedule: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: Date,
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: String,
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  },
  location: {
    venue: String,
    address: String,
    city: String,
    meetingLink: String, // For online events
    instructions: String
  },
  capacity: {
    maxAttendees: {
      type: Number,
      required: [true, 'Max attendees is required']
    },
    currentAttendees: {
      type: Number,
      default: 0
    }
  },
  registration: {
    isRequired: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      required: [true, 'Registration start date is required']
    },
    deadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    fee: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'INR'
      }
    }
  },
  attendees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    organization: String,
    jobTitle: String,
    city: String,
    experience: String,
    expectations: String,
    dietaryRestrictions: String,
    emergencyContact: String,
    emergencyPhone: String,
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  resources: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'presentation']
    }
  }],
  feedback: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    interval: Number, // Every X days/weeks/months
    endDate: Date
  }
}, {
  timestamps: true
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  return this.capacity.maxAttendees - this.capacity.currentAttendees;
});

// Virtual for registration status
eventSchema.virtual('registrationOpen').get(function() {
  if (!this.registration.isRequired) return true;
  
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of day for comparison
  
  const startDate = this.registration.startDate ? new Date(this.registration.startDate) : null;
  const deadline = this.registration.deadline ? new Date(this.registration.deadline) : null;
  
  // Set dates to start/end of day for proper comparison
  if (startDate) {
    startDate.setHours(0, 0, 0, 0);
  }
  if (deadline) {
    deadline.setHours(23, 59, 59, 999);
  }
  
  // Check if registration period has started
  if (startDate && now < startDate) {
    console.log('Registration not started yet:', { now, startDate });
    return false;
  }
  
  // Check if registration deadline has passed
  if (deadline && now > deadline) {
    console.log('Registration deadline passed:', { now, deadline });
    return false;
  }
  
  // Check if event is at capacity
  const isAtCapacity = this.capacity.currentAttendees >= this.capacity.maxAttendees;
  if (isAtCapacity) {
    console.log('Event at capacity:', { current: this.capacity.currentAttendees, max: this.capacity.maxAttendees });
    return false;
  }
  
  console.log('Registration should be open:', { now, startDate, deadline, currentAttendees: this.capacity.currentAttendees, maxAttendees: this.capacity.maxAttendees });
  return true;
});

// Index for better performance
eventSchema.index({ 'schedule.startDate': 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ tags: 1 });

export default mongoose.model('Event', eventSchema);