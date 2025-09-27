import mongoose from 'mongoose';

const mentorSessionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionDate: {
    type: Date,
    required: [true, 'Session date is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    default: 60 // in minutes
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  sessionType: {
    type: String,
    enum: ['video-call', 'phone-call', 'chat', 'in-person'],
    default: 'video-call'
  },
  meetingLink: {
    type: String
  },
  topics: [{
    type: String
  }],
  notes: {
    mentorNotes: {
      type: String,
      maxlength: 1000
    },
    studentNotes: {
      type: String,
      maxlength: 1000
    }
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    paymentId: String
  },
  feedback: {
    studentRating: {
      type: Number,
      min: 1,
      max: 5
    },
    studentComment: {
      type: String,
      maxlength: 500
    },
    mentorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    mentorComment: {
      type: String,
      maxlength: 500
    }
  }
}, {
  timestamps: true
});

// Index for better performance
mentorSessionSchema.index({ mentor: 1, sessionDate: 1 });
mentorSessionSchema.index({ student: 1, sessionDate: 1 });
mentorSessionSchema.index({ status: 1 });

export default mongoose.model('MentorSession', mentorSessionSchema);