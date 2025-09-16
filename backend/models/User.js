import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: false, // Only required for Google users
    unique: true,
    sparse: true, // Allows multiple docs with undefined firebaseUid
  },
  password: {
    type: String,
    required: false, // Only required for local users
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  profile: {
    interests: [String],
    academic: {
      level: {
        type: String,
        enum: ['high-school', 'intermediate', 'undergraduate', 'postgraduate'],
      },
      stream: String,
      subjects: [String],
      marks: String,
      institution: String,
      yearOfStudy: Number,
    },
    skills: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner',
      },
      category: {
        type: String,
        enum: ['technical', 'soft', 'language', 'domain'],
        default: 'technical',
      },
    }],
    goals: [String],
    experience: [{
      title: String,
      organization: String,
      duration: String,
      description: String,
      type: {
        type: String,
        enum: ['internship', 'job', 'project', 'volunteer', 'extracurricular'],
      },
    }],
  },
  assessmentResults: [{
    category: String,
    score: Number,
    percentile: Number,
    strengths: [String],
    recommendations: [String],
    completedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  careerRecommendations: [{
    title: String,
    description: String,
    matchPercentage: Number,
    requiredSkills: [String],
    averageSalary: String,
    growthPotential: {
      type: String,
      enum: ['high', 'medium', 'low'],
    },
    pathways: [String],
    industry: String,
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  learningPath: {
    currentMilestones: [{
      title: String,
      description: String,
      targetDate: Date,
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: Date,
      resources: [String],
    }],
    completedCourses: [String],
    skillProgress: [{
      skillName: String,
      currentLevel: Number,
      targetLevel: Number,
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
    privacy: {
      profileVisible: {
        type: Boolean,
        default: false,
      },
      shareData: {
        type: Boolean,
        default: true,
      },
    },
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
userSchema.index({ firebaseUid: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'profile.academic.level': 1 });
userSchema.index({ 'profile.academic.stream': 1 });

export default mongoose.model('User', userSchema);