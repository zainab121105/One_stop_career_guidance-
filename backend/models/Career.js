import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  requiredSkills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    },
    importance: {
      type: String,
      enum: ['essential', 'preferred', 'optional'],
      default: 'preferred',
    },
  }],
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR',
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly',
    },
  },
  growthPotential: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  educationRequirements: [{
    level: String,
    field: String,
    essential: Boolean,
  }],
  jobMarketData: {
    demandLevel: {
      type: String,
      enum: ['very-high', 'high', 'medium', 'low', 'very-low'],
    },
    openings: Number,
    trendDirection: {
      type: String,
      enum: ['growing', 'stable', 'declining'],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  learningPaths: [{
    title: String,
    description: String,
    duration: String,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    resources: [{
      type: String,
      title: String,
      url: String,
      provider: String,
      cost: Number,
    }],
  }],
  relatedCareers: [String],
  workEnvironment: {
    type: [String],
    default: [],
  },
  keyResponsibilities: [String],
}, {
  timestamps: true,
});

// Indexes
careerSchema.index({ category: 1 });
careerSchema.index({ industry: 1 });
careerSchema.index({ 'jobMarketData.demandLevel': 1 });
careerSchema.index({ growthPotential: 1 });

export default mongoose.model('Career', careerSchema);