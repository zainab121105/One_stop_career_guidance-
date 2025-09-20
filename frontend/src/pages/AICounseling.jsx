import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Clock, 
  MessageCircle,
  Lightbulb,
  Target,
  BookOpen,
  Sparkles,
  Mic,
  Paperclip,
  Loader,
  AlertCircle,
  Zap,
  Brain,
  Star,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import { aiCounselingAPI } from '../services/api';

const AICounseling = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const messagesEndRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const shouldAutoScrollRef = useRef(false);
  const messagesContainerRef = useRef(null);
  const userScrolledRef = useRef(false);

  const quickQuestions = [
    "What career path suits my skills?",
    "How to switch careers?",
    "Best courses for my goals?",
    "Salary expectations for my field?",
    "Skills gap analysis",
    "Interview preparation tips"
  ];

  // Initialize component - load existing session or create new one
  useEffect(() => {
    initializeChatSession();
    loadStats();
  }, []);

  const initializeChatSession = async () => {
    try {
      setIsLoading(true);
      // Generate a new session ID for this chat session
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      
      // Add welcome message without triggering auto-scroll
      setMessages([{
        id: 1,
        type: 'bot',
        content: "Hello! I'm your AI Career Counselor powered by Google AI. I'm here 24/7 to help guide your career journey with personalized advice. What would you like to discuss today?",
        timestamp: new Date()
      }]);
      
      // Keep initial load flag as true to prevent auto-scroll
      shouldAutoScrollRef.current = false;
      setError(null);
    } catch (err) {
      console.error('Error initializing chat session:', err);
      setError('Failed to initialize chat session. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await aiCounselingAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const scrollToBottom = () => {
    if (shouldAutoScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      shouldAutoScrollRef.current = false; // Reset after scrolling
    }
  };

  const checkIfUserIsNearBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      return scrollHeight - scrollTop - clientHeight < 100; // Within 100px of bottom
    }
    return false;
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const isNearBottom = checkIfUserIsNearBottom();
      // If user scrolled away from bottom, remember they manually scrolled
      if (!isNearBottom) {
        userScrolledRef.current = true;
      } else {
        userScrolledRef.current = false;
      }
    }
  };

  useEffect(() => {
    // Only auto-scroll in these specific cases:
    // 1. When shouldAutoScrollRef is explicitly set to true (user sends message)
    // 2. When typing indicator appears AND user hasn't manually scrolled away AND user is near bottom
    if (shouldAutoScrollRef.current) {
      const timer = setTimeout(() => scrollToBottom(), 150);
      return () => clearTimeout(timer);
    } else if (isTyping && !isInitialLoadRef.current && !userScrolledRef.current && checkIfUserIsNearBottom()) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
    
    // Mark initial load as complete after first render
    if (isInitialLoadRef.current && messages.length > 0) {
      isInitialLoadRef.current = false;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping || !sessionId) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    // Add user message immediately and enable auto-scroll for this interaction
    setMessages(prev => [...prev, userMessage]);
    shouldAutoScrollRef.current = true; // Enable auto-scroll for this message
    userScrolledRef.current = false; // Reset manual scroll flag since user is actively engaging
    const currentInput = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      // Send message to backend
      const response = await aiCounselingAPI.sendMessage(currentInput, sessionId);
      
      if (response.success) {
        // Add AI response
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        // Update stats
        if (stats) {
          setStats(prev => ({
            ...prev,
            totalMessages: prev.totalMessages + 2
          }));
        }
      } else {
        throw new Error(response.message || 'Failed to get AI response');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment. If the problem persists, you can still explore the quick questions below for guidance.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = async (question) => {
    if (isTyping || !sessionId) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    // Add user message immediately and enable auto-scroll for this interaction
    setMessages(prev => [...prev, userMessage]);
    shouldAutoScrollRef.current = true; // Enable auto-scroll for this message
    userScrolledRef.current = false; // Reset manual scroll flag since user is actively engaging
    setIsTyping(true);
    setError(null);

    try {
      // Send message to backend
      const response = await aiCounselingAPI.sendMessage(question, sessionId);
      
      if (response.success) {
        // Add AI response
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        // Update stats
        if (stats) {
          setStats(prev => ({
            ...prev,
            totalMessages: prev.totalMessages + 2
          }));
        }
      } else {
        throw new Error(response.message || 'Failed to get AI response');
      }
    } catch (err) {
      console.error('Error sending quick question:', err);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <DashboardNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce"></div>
              </div>
              <p className="text-gray-700 font-medium">Initializing AI Counselor...</p>
              <p className="text-gray-500 text-sm mt-2">Setting up your personalized experience</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform duration-300 shadow-lg">
                <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              AI Career Counselor
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Your intelligent career companion powered by advanced AI technology
            </p>
            <div className="flex items-center justify-center space-x-6 mt-6">
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Online 24/7</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Instant Responses</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-600">
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium">AI Powered</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Mobile-first responsive layout */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Chat Interface */}
          <div className="flex-1 xl:flex-initial xl:w-3/4">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="p-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-indigo-600/90"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative z-10 flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">AI Career Counselor</h3>
                    <p className="text-white/80 text-sm">Ready to help you achieve your goals</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <Star className="w-4 h-4 text-yellow-300" />
                      <span className="text-sm font-medium">Premium AI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 p-6 overflow-y-auto space-y-6 h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-b from-white/50 to-gray-50/50"
              >
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                  >
                    <div className={`flex max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-3 group`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white ml-3' 
                          : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 text-white mr-3'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-5 h-5" />
                        ) : (
                          <Bot className="w-5 h-5" />
                        )}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`relative px-6 py-4 rounded-2xl shadow-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white border-purple-300/30'
                          : 'bg-white/90 text-gray-800 border-gray-200/50 hover:bg-white/95'
                      }`}>
                        {/* Message bubble arrow */}
                        <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                          message.type === 'user'
                            ? 'right-[-6px] bg-gradient-to-br from-purple-500 to-pink-500'
                            : 'left-[-6px] bg-white/90 border-l border-t border-gray-200/50'
                        }`}></div>
                        
                        <div className="relative z-10">
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 opacity-70 ${
                            message.type === 'user' ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        
                        {/* Subtle shine effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start animate-fadeInUp">
                    <div className="flex max-w-[85%] flex-row items-end space-x-3 group">
                      {/* AI Avatar */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 text-white mr-3 shadow-lg animate-pulse">
                        <Bot className="w-5 h-5" />
                      </div>
                      
                      {/* Typing Bubble */}
                      <div className="relative px-6 py-4 rounded-2xl bg-white/90 border border-gray-200/50 shadow-xl backdrop-blur-sm">
                        {/* Typing bubble arrow */}
                        <div className="absolute top-4 left-[-6px] w-3 h-3 bg-white/90 border-l border-t border-gray-200/50 transform rotate-45"></div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 bg-gradient-to-r from-white/80 via-gray-50/80 to-white/80 backdrop-blur-xl border-t border-gray-200/50">
                <div className="flex items-center space-x-4">
                  <button className="p-3 text-gray-400 hover:text-purple-600 transition-all duration-300 rounded-xl hover:bg-purple-50 group">
                    <Paperclip className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your career..."
                      disabled={isTyping}
                      className="w-full px-6 py-4 border-2 border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl placeholder:text-gray-400"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  
                  <button className="p-3 text-gray-400 hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-blue-50 group">
                    <Mic className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-4 rounded-2xl hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 group flex items-center justify-center"
                  >
                    {isTyping ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:w-1/4 space-y-6">
            {/* Quick Questions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full translate-y-8 -translate-x-8"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Quick Questions</h3>
                    <p className="text-sm text-gray-600">Get instant guidance</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      disabled={isTyping}
                      className="w-full text-left p-4 text-sm bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl hover:from-purple-50 hover:to-blue-50 border border-gray-200/50 hover:border-purple-300/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300 shadow-sm">
                          <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <span className="flex-1 text-gray-700 group-hover:text-gray-900 font-medium">{question}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl border border-purple-200/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-900">Pro Tip</span>
                  </div>
                  <p className="text-xs text-purple-700">
                    Click any question above for instant AI-powered career guidance tailored to your goals!
                  </p>
                </div>
              </div>
            </div>

            {/* AI Features */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full -translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">AI Features</h3>
                    <p className="text-sm text-gray-600">Powered by advanced AI</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4">
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Personalized Guidance</h4>
                      <p className="text-xs text-gray-600">Tailored advice based on your profile</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">24/7 Availability</h4>
                      <p className="text-xs text-gray-600">Get help anytime, anywhere</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Learning Resources</h4>
                      <p className="text-xs text-gray-600">Curated courses and materials</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full -translate-y-8 translate-x-8"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Session Stats</h3>
                    <p className="text-sm text-gray-600">Your progress today</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{messages.length}</div>
                    <div className="text-xs text-gray-600 font-medium">Messages today</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats?.totalSessions || 0}</div>
                    <div className="text-xs text-gray-600 font-medium">Total sessions</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats?.totalMessages || 0}</div>
                    <div className="text-xs text-gray-600 font-medium">Total messages</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200/50">
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{stats?.recentActivity || 0}</div>
                    <div className="text-xs text-gray-600 font-medium">Recent activity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICounseling;