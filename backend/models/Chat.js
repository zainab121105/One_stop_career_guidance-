import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [messageSchema],
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  chatType: {
    type: String,
    enum: ['mentor-student', 'general'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor'
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatSchema.index({ participants: 1 });
chatSchema.index({ 'lastMessage.timestamp': -1 });

// Method to add a message
chatSchema.methods.addMessage = function(senderId, content, messageType = 'text') {
  const message = {
    sender: senderId,
    content,
    messageType,
    timestamp: new Date(),
    readBy: [{ user: senderId }]
  };
  
  this.messages.push(message);
  this.lastMessage = {
    content,
    sender: senderId,
    timestamp: message.timestamp
  };
  
  return this.save();
};

// Method to mark messages as read
chatSchema.methods.markAsRead = function(userId) {
  this.messages.forEach(message => {
    if (!message.readBy.some(read => read.user.toString() === userId.toString())) {
      message.readBy.push({ user: userId });
    }
  });
  
  return this.save();
};

// Static method to find or create chat between users
chatSchema.statics.findOrCreateChat = async function(user1Id, user2Id, mentorId = null) {
  let chat = await this.findOne({
    participants: { $all: [user1Id, user2Id] },
    isActive: true
  }).populate('participants', 'name email');
  
  if (!chat) {
    chat = new this({
      participants: [user1Id, user2Id],
      chatType: mentorId ? 'mentor-student' : 'general',
      mentorId,
      messages: []
    });
    await chat.save();
    chat = await chat.populate('participants', 'name email');
  }
  
  return chat;
};

export default mongoose.model('Chat', chatSchema);