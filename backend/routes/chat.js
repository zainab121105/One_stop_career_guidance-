import express from 'express';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Mentor from '../models/Mentor.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all chats for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chats = await Chat.find({
      participants: userId,
      isActive: true
    })
    .populate('participants', 'name email')
    .populate('mentorId', 'name expertise')
    .sort({ 'lastMessage.timestamp': -1 });

    // Calculate unread count for each chat
    const chatsWithUnread = chats.map(chat => {
      const unreadCount = chat.messages.filter(message => 
        message.sender.toString() !== userId.toString() &&
        !message.readBy.some(read => read.user.toString() === userId.toString())
      ).length;

      return {
        ...chat.toObject(),
        unreadCount
      };
    });

    res.json({
      success: true,
      data: chatsWithUnread
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats',
      error: error.message
    });
  }
});

// Start a new chat with a mentor
router.post('/start-chat', auth, async (req, res) => {
  try {
    const { mentorUserId, mentorId } = req.body;
    const userId = req.user._id;

    if (!mentorUserId) {
      return res.status(400).json({
        success: false,
        message: 'Mentor user ID is required'
      });
    }

    // Verify the mentor user exists
    const mentorUser = await User.findById(mentorUserId);
    if (!mentorUser) {
      return res.status(404).json({
        success: false,
        message: 'Mentor user not found'
      });
    }

    // Find or create chat
    const chat = await Chat.findOrCreateChat(userId, mentorUserId, mentorId);

    res.json({
      success: true,
      data: chat,
      message: 'Chat started successfully'
    });
  } catch (error) {
    console.error('Error starting chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start chat',
      error: error.message
    });
  }
});

// Get messages for a specific chat
router.get('/:chatId/messages', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
      isActive: true
    }).populate('messages.sender', 'name email');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }

    // Mark messages as read
    await chat.markAsRead(userId);

    // Get paginated messages (newest first)
    const skip = (page - 1) * limit;
    const messages = chat.messages
      .slice(-skip - limit, -skip || undefined)
      .reverse();

    res.json({
      success: true,
      data: {
        chatId: chat._id,
        messages,
        totalMessages: chat.messages.length,
        hasMore: skip + limit < chat.messages.length
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// Send a message
router.post('/:chatId/messages', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const userId = req.user._id;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
      isActive: true
    }).populate('participants', 'name email');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }

    // Add the message
    await chat.addMessage(userId, content.trim(), messageType);

    // Get the newly added message with sender details
    const newMessage = chat.messages[chat.messages.length - 1];
    await chat.populate('messages.sender', 'name email');

    res.json({
      success: true,
      data: {
        message: newMessage,
        chatId: chat._id
      },
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Delete a chat
router.delete('/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }

    // Soft delete - mark as inactive
    chat.isActive = false;
    await chat.save();

    res.json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat',
      error: error.message
    });
  }
});

// Get chat details
router.get('/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
      isActive: true
    })
    .populate('participants', 'name email')
    .populate('mentorId', 'name expertise');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }

    // Calculate unread count
    const unreadCount = chat.messages.filter(message => 
      message.sender.toString() !== userId.toString() &&
      !message.readBy.some(read => read.user.toString() === userId.toString())
    ).length;

    res.json({
      success: true,
      data: {
        ...chat.toObject(),
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching chat details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat details',
      error: error.message
    });
  }
});

export default router;