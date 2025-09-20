import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    responseTime: Number,
    model: String,
    tokens: Number
  }
});

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: 'New Chat Session'
  },
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  summary: {
    type: String,
    maxlength: 500
  },
  tags: [{
    type: String,
    maxlength: 50
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
chatSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

// Index for efficient queries
chatSessionSchema.index({ userId: 1, createdAt: -1 });
chatSessionSchema.index({ userId: 1, status: 1 });
chatSessionSchema.index({ sessionId: 1 });

// Virtual for message count
chatSessionSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Virtual for user message count
chatSessionSchema.virtual('userMessageCount').get(function() {
  return this.messages.filter(msg => msg.type === 'user').length;
});

// Virtual for duration
chatSessionSchema.virtual('duration').get(function() {
  if (this.messages.length < 2) return 0;
  const first = this.messages[0].timestamp;
  const last = this.messages[this.messages.length - 1].timestamp;
  return last - first;
});

// Auto-generate title from first user message
chatSessionSchema.methods.generateTitle = function() {
  const firstUserMessage = this.messages.find(msg => msg.type === 'user');
  if (firstUserMessage) {
    const content = firstUserMessage.content;
    // Take first 30 characters and add ellipsis if longer
    this.title = content.length > 30 ? content.substring(0, 30) + '...' : content;
  }
};

// Add message to session
chatSessionSchema.methods.addMessage = function(type, content, metadata = {}) {
  this.messages.push({
    type,
    content,
    timestamp: new Date(),
    metadata
  });
  
  // Auto-generate title from first user message
  if (type === 'user' && this.messages.filter(m => m.type === 'user').length === 1) {
    this.generateTitle();
  }
  
  return this.save();
};

// Get recent messages (default last 10)
chatSessionSchema.methods.getRecentMessages = function(limit = 10) {
  return this.messages.slice(-limit);
};

// Archive session
chatSessionSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Static method to create new session
chatSessionSchema.statics.createSession = async function(userId, sessionId) {
  const session = new this({
    userId,
    sessionId,
    messages: []
  });
  return session.save();
};

// Static method to find or create session
chatSessionSchema.statics.findOrCreateSession = async function(userId, sessionId) {
  let session = await this.findOne({ userId, sessionId, status: 'active' });
  if (!session) {
    session = await this.createSession(userId, sessionId);
  }
  return session;
};

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;