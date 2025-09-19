import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['course_completed', 'badge_earned', 'assessment_taken', 'login', 'profile_updated', 'onboarding_completed']
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better performance
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ type: 1 });

export default mongoose.model('Activity', activitySchema);