import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  company: {
    type: String,
    required: [true, 'Company is required']
  },
  bio: {
    type: String,
    maxlength: 500
  },
  experience: {
    type: String,
    required: [true, 'Experience is required']
  },
  expertise: [{
    type: String,
    required: true
  }],
  languages: [{
    type: String,
    default: ['English']
  }],
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Away'],
    default: 'Available'
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Price amount is required']
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: ''
  },
  schedule: {
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    availableSlots: [{
      day: String, // 'monday', 'tuesday', etc.
      startTime: String, // '09:00'
      endTime: String // '17:00'
    }]
  }
}, {
  timestamps: true
});

// Index for better search performance
mentorSchema.index({ expertise: 1 });
mentorSchema.index({ location: 1 });
mentorSchema.index({ 'rating.average': -1 });
mentorSchema.index({ availability: 1 });

export default mongoose.model('Mentor', mentorSchema);