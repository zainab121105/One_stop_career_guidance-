import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  onboardingData: {
    currentLevel: {
      type: String,
      enum: ['high-school', 'college', 'graduate', 'professional']
    },
    careerStage: {
      type: String,
      enum: ['exploring', 'deciding', 'switching', 'advancing']
    },
    interests: [{
      type: String,
      enum: ['technology', 'creative', 'business', 'science', 'healthcare', 'education', 'social', 'finance']
    }],
    goals: [{
      type: String,
      enum: ['high-salary', 'work-life-balance', 'job-security', 'creativity', 'impact', 'flexibility']
    }],
    preferredLearningStyle: {
      type: String,
      enum: ['visual', 'hands-on', 'reading', 'interactive']
    },
    timeCommitment: {
      type: String,
      enum: ['1-2-hours', '3-5-hours', '6-10-hours', '10-plus-hours']
    }
  },
  profile: {
    avatar: String,
    bio: String,
    location: String,
    currentRole: String,
    experience: String
  },
  stats: {
    completedCourses: {
      type: Number,
      default: 0
    },
    totalBadges: {
      type: Number,
      default: 0
    },
    studyHours: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: Date
  },
  badges: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    weeklyReport: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Add welcome badge for new users
userSchema.post('save', async function(doc, next) {
  if (doc.isNew && doc.badges.length === 0) {
    doc.badges.push({
      name: 'Welcome Badge',
      description: 'Completed profile setup',
      icon: 'welcome'
    });
    doc.stats.totalBadges = 1;
    await doc.save();
  }
  next();
});

export default mongoose.model('User', userSchema);