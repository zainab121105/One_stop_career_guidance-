import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  Video,
  Calendar,
  Star,
  MapPin,
  BookOpen,
  Phone,
  Mail,
  Search,
  Filter,
  Clock,
  Award,
  Heart,
  Reply,
  Plus,
  Send,
  Edit,
  Trash2
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import NewPostModal from '../components/NewPostModal';
import NewEventModal from '../components/NewEventModal';
import EventRegistrationModal from '../components/EventRegistrationModal';
import AddMentorModal from '../components/AddMentorModal';
import ChatModal from '../components/ChatModal';
import BookingModal from '../components/BookingModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('mentors');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for different sections
  const [mentors, setMentors] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  // Modal state
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  
  // Reply functionality state
  const [expandedPost, setExpandedPost] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'mentors') {
          const response = await api.get('/mentors');
          setMentors(response.data.mentors || []);
        } else if (activeTab === 'forum') {
          const [postsRes, categoriesRes] = await Promise.all([
            api.get('/forum/posts'),
            api.get('/forum/categories')
          ]);
          setForumPosts(postsRes.data.posts || []);
          setCategories(categoriesRes.data || []);
        } else if (activeTab === 'events') {
          const [eventsRes, categoriesRes] = await Promise.all([
            api.get('/events'),
            api.get('/events/categories')
          ]);
          setEvents(eventsRes.data.events || []);
          setCategories(categoriesRes.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  // Filter mentors based on search
  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle mentor session booking - open booking modal
  const handleBookSession = (mentor) => {
    setSelectedMentor(mentor);
    setIsBookingModalOpen(true);
  };

  // Handle successful booking
  const handleBookingSuccess = (sessionDetails) => {
    console.log('Session booked:', sessionDetails);
    // Optionally refresh mentors or update UI
    refreshMentors();
  };

  // Refresh mentors data
  const refreshMentors = async () => {
    try {
      const response = await api.get('/mentors');
      setMentors(response.data.mentors || []);
    } catch (error) {
      console.error('Error refreshing mentors:', error);
    }
  };

  // Handle starting a chat with mentor
  const handleStartChat = (mentor) => {
    setSelectedMentor(mentor);
    setIsChatModalOpen(true);
  };

  // Handle adding new mentor
  const handleAddMentor = async (mentorData) => {
    try {
      const response = await api.post('/mentors', mentorData);
      console.log('Mentor added successfully:', response.data);
      
      // Refresh mentors data to show the new mentor
      await refreshMentors();
      
      // If we're not on the mentors tab, switch to it
      if (activeTab !== 'mentors') {
        setActiveTab('mentors');
      }
      
      alert('Mentor added successfully!');
    } catch (error) {
      console.error('Error adding mentor:', error);
      
      // Show specific error message
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        alert(`Failed to add mentor: ${errorMessages}`);
      } else if (error.response?.data?.message) {
        alert(`Failed to add mentor: ${error.response.data.message}`);
      } else {
        alert('Failed to add mentor. Please try again.');
      }
      
      throw error; // Re-throw to handle in modal
    }
  };

  // Handle forum post like
  const handleLikePost = async (postId) => {
    try {
      const response = await api.post(`/forum/posts/${postId}/like`);
      // Update the post in state
      setForumPosts(posts => 
        posts.map(post => 
          post._id === postId 
            ? { ...post, likeCount: response.data.likeCount }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle expanding/collapsing post for replies
  const handleTogglePost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
    setReplyText('');
  };

  // Handle reply submission
  const handleReplySubmit = async (postId) => {
    if (!replyText.trim() || submittingReply) return;

    setSubmittingReply(true);
    try {
      const response = await api.post(`/forum/posts/${postId}/reply`, {
        content: replyText.trim()
      });

      // Update the post with the new reply
      setForumPosts(posts => 
        posts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                replies: [...(post.replies || []), response.data.reply],
                replyCount: (post.replyCount || 0) + 1
              }
            : post
        )
      );

      setReplyText('');
      alert('Reply added successfully!');
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  };

  // Handle creating new forum post
  const handleCreatePost = async (postData) => {
    try {
      const response = await api.post('/forum/posts', postData);
      
      if (response.data && response.data.post) {
        // Add new post to the beginning of the list with proper structure
        const newPost = {
          ...response.data.post,
          author: {
            name: response.data.post.author.name || 'Anonymous',
            userId: response.data.post.author.userId
          },
          likeCount: 0,
          replyCount: 0,
          likes: [],
          replies: [],
          timeAgo: 'Just now'
        };
        
        setForumPosts(posts => [newPost, ...posts]);
        
        // If we're not on the discussion forum tab, switch to it
        if (activeTab !== 'forum') {
          setActiveTab('forum');
        }
        
        alert('Post created successfully!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Show more specific error message
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        alert(`Failed to create post: ${errorMessages}`);
      } else if (error.response?.data?.message) {
        alert(`Failed to create post: ${error.response.data.message}`);
      } else {
        alert('Failed to create post. Please try again.');
      }
      
      throw error; // Re-throw to handle in modal
    }
  };

  // Handle creating new event
  const handleCreateEvent = async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      console.log('Event created successfully:', response.data);
      
      // Refresh events data to get the most up-to-date information including virtual fields
      await refreshEvents();
      
      // If we're not on the events tab, switch to it
      if (activeTab !== 'events') {
        setActiveTab('events');
      }
      
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      
      // Show more specific error message
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        alert(`Failed to create event: ${errorMessages}`);
      } else if (error.response?.data?.message) {
        alert(`Failed to create event: ${error.response.data.message}`);
      } else {
        alert('Failed to create event. Please try again.');
      }
      
      throw error; // Re-throw to handle in modal
    }
  };

  // Refresh events data
  const refreshEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error refreshing events:', error);
    }
  };

  // Handle event registration with detailed form
  const handleRegisterEvent = async (eventId, registrationData) => {
    try {
      await api.post(`/events/${eventId}/register`, registrationData);
      alert('Successfully registered for event!');
      // Refresh events data
      await refreshEvents();
    } catch (error) {
      console.error('Error registering for event:', error);
      alert(error.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  // Handle opening registration modal
  const handleOpenRegistration = (event) => {
    setSelectedEvent(event);
    setIsRegistrationModalOpen(true);
  };

  const handleUnregisterEvent = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}/register`);
      alert('Successfully unregistered from event!');
      // Refresh events data
      await refreshEvents();
    } catch (error) {
      console.error('Error unregistering from event:', error);
      alert(error.response?.data?.message || 'Failed to unregister. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.delete(`/events/${eventId}`);
      alert('Event deleted successfully!');
      // Remove event from local state
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return 'text-green-600 bg-green-100';
      case 'Busy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community & Support</h1>
              <p className="text-gray-600">Connect with mentors, teachers, and peers for career guidance</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'mentors', label: 'Find Mentors', icon: Users },
              { id: 'forum', label: 'Discussion Forum', icon: MessageCircle },
              { id: 'events', label: 'Events & Workshops', icon: Calendar }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'mentors' && (
          <div>
            {/* Header with Add Mentor Button */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Find Mentors</h2>
              <button 
                onClick={() => setIsAddMentorModalOpen(true)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Mentor</span>
              </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search mentors by name or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mentors Grid */}
            {loading ? (
              <div className="text-center py-8">Loading mentors...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <div key={mentor._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
                        {mentor.profileImage || '👤'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.title}</p>
                        <p className="text-xs text-gray-500">{mentor.company}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-700 mb-4">{mentor.bio}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-bold text-gray-900">{mentor.rating?.average || 0}</span>
                        </div>
                        <p className="text-xs text-gray-500">{mentor.rating?.count || 0} reviews</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-bold text-gray-900">{mentor.experience}</span>
                        </div>
                        <p className="text-xs text-gray-500">experience</p>
                      </div>
                    </div>

                    {/* Expertise */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">EXPERTISE</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{mentor.location}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(mentor.availability)}`}>
                          {mentor.availability}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-gray-900">₹{mentor.price?.amount || 0}/{mentor.price?.currency === 'INR' ? 'hour' : 'hour'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleBookSession(mentor)}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                          mentor.availability === 'Available' 
                            ? 'bg-primary-500 text-white hover:bg-primary-600' 
                            : mentor.availability === 'Busy'
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-400 text-white hover:bg-gray-500'
                        }`}
                        title={
                          mentor.availability === 'Available' 
                            ? 'Book an immediate session' 
                            : mentor.availability === 'Busy'
                            ? 'Request a session - mentor will confirm'
                            : 'Request a session when mentor returns'
                        }
                      >
                        <Video className="w-4 h-4" />
                        <span>
                          {mentor.availability === 'Available' 
                            ? 'Book Session' 
                            : 'Request Session'}
                        </span>
                      </button>
                      <button 
                        onClick={() => handleStartChat(mentor)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Start a chat conversation"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Discussions</h2>
                  <button 
                    onClick={() => setIsNewPostModalOpen(true)}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Post</span>
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">Loading forum posts...</div>
                ) : (
                  <div className="space-y-4">
                    {forumPosts.map((post) => (
                      <div key={post._id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors">
                        {/* Main Post Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 
                              className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer"
                              onClick={() => handleTogglePost(post._id)}
                            >
                              {post.title}
                            </h3>
                            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                              {post.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>by {post.author?.name} • {post.timeAgo}</span>
                            <div className="flex items-center space-x-4">
                              <button 
                                onClick={() => handleLikePost(post._id)}
                                className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                              >
                                <Heart className="w-4 h-4" />
                                <span>{post.likeCount || 0}</span>
                              </button>
                              <button
                                onClick={() => handleTogglePost(post._id)}
                                className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                              >
                                <Reply className="w-4 h-4" />
                                <span>{post.replyCount || 0} replies</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content with Replies */}
                        {expandedPost === post._id && (
                          <div className="border-t border-gray-100">
                            {/* Full Post Content */}
                            <div className="p-4 bg-gray-50">
                              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                            </div>

                            {/* Replies Section */}
                            <div className="p-4 border-t border-gray-100">
                              <h4 className="font-medium text-gray-900 mb-3">Replies ({post.replyCount || 0})</h4>
                              
                              {/* Existing Replies */}
                              {post.replies && post.replies.length > 0 && (
                                <div className="space-y-3 mb-4">
                                  {post.replies.map((reply, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-100">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">{reply.author?.name}</span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(reply.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Reply Form */}
                              <div className="bg-white rounded-lg border border-gray-200 p-3">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Write your reply..."
                                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  rows="3"
                                />
                                <div className="flex justify-between items-center mt-3">
                                  <span className="text-xs text-gray-500">
                                    {replyText.length}/2000 characters
                                  </span>
                                  <button
                                    onClick={() => handleReplySubmit(post._id)}
                                    disabled={!replyText.trim() || submittingReply}
                                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {submittingReply ? 'Posting...' : 'Post Reply'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Popular Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.name} className="flex justify-between items-center py-2">
                      <span className="text-gray-700">{category.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={refreshEvents}
                    className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                  <button 
                    onClick={() => setIsNewEventModalOpen(true)}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-8">Loading events...</div>
              ) : (
                events.map((event) => {
                  const isEventCreator = user && event.organizer?.userId === user._id;
                  const isUserRegistered = user && event.attendees?.some(attendee => attendee.userId === user._id);
                  

                  
                  return (
                    <div key={event._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-600">by {event.organizer?.name}</p>
                          {event.organizer?.organization && (
                            <p className="text-xs text-gray-500">{event.organizer.organization}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                            {event.type}
                          </span>
                          {event.category && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {event.category}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(event.schedule.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{event.schedule.startTime}</span>
                        </div>
                      </div>

                      {/* Registration Period */}
                      {event.registration && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Registration Information</h4>
                          <div className="space-y-1">
                            {event.registration.startDate && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Opens:</span> {new Date(event.registration.startDate).toLocaleDateString()}
                              </div>
                            )}
                            {event.registration.deadline && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Closes:</span> {new Date(event.registration.deadline).toLocaleDateString()}
                              </div>
                            )}
                            {event.registration.fee && event.registration.fee.amount > 0 && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Fee:</span> ₹{event.registration.fee.amount}
                              </div>
                            )}
                            <div className={`text-sm font-medium flex items-center space-x-1 ${
                              event.registrationOpen ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                event.registrationOpen ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              <span>{event.registrationOpen ? 'Registration Open' : 'Registration Closed'}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Venue Details */}
                      {event.location && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Location Details</h4>
                          <div className="space-y-1">
                            {event.type === 'Online' || event.type === 'Hybrid' ? (
                              event.location.meetingLink && (
                                <div className="flex items-center space-x-2">
                                  <Video className="w-4 h-4 text-gray-400" />
                                  <a 
                                    href={event.location.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                                  >
                                    Join Meeting
                                  </a>
                                </div>
                              )
                            ) : null}
                            
                            {(event.type === 'Offline' || event.type === 'Hybrid') && (
                              <div className="space-y-1">
                                {event.location.venue && (
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{event.location.venue}</span>
                                  </div>
                                )}
                                {event.location.address && (
                                  <p className="text-sm text-gray-500 ml-6">{event.location.address}</p>
                                )}
                                {event.location.city && (
                                  <p className="text-sm text-gray-500 ml-6">{event.location.city}</p>
                                )}
                              </div>
                            )}
                            
                            {event.location.instructions && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Instructions:</span> {event.location.instructions}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Speakers */}
                      {event.speakers && event.speakers.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Speakers</h4>
                          {event.speakers.map((speaker, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-primary-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{speaker.name}</p>
                                {speaker.title && speaker.company && (
                                  <p className="text-xs text-gray-500">{speaker.title} at {speaker.company}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Attendees</span>
                          <span className="text-gray-900">
                            {event.capacity?.currentAttendees || 0}/{event.capacity?.maxAttendees || 'Unlimited'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ 
                              width: `${((event.capacity?.currentAttendees || 0) / (event.capacity?.maxAttendees || 100)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex space-x-2">
                        {isEventCreator ? (
                          // Event creator sees edit/delete buttons
                          <>
                            <button 
                              onClick={() => alert('Edit functionality coming soon!')}
                              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit Event</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteEvent(event._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          // Regular users see register/unregister button
                          <>
                            {isUserRegistered ? (
                              <button 
                                onClick={() => handleUnregisterEvent(event._id)}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Unregister
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleOpenRegistration(event)}
                                disabled={!event.registrationOpen}
                                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                                  event.registrationOpen
                                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                {event.registrationOpen ? 'Register Now' : 'Registration Closed'}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Event Categories</h3>
              <div className="space-y-3">
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <Calendar className="w-5 h-5 text-primary-500" />
                      <div className="flex-1">
                        <span className="text-gray-700">{category.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({category.count || 0})</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p>No event categories yet</p>
                    <p className="text-sm">Categories will appear when events are created</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* New Event Modal */}
      <NewEventModal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSubmit={handleCreateEvent}
      />

      {/* Event Registration Modal */}
      <EventRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => {
          setIsRegistrationModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSubmit={handleRegisterEvent}
      />

      {/* Add Mentor Modal */}
      <AddMentorModal
        isOpen={isAddMentorModalOpen}
        onClose={() => setIsAddMentorModalOpen(false)}
        onSubmit={handleAddMentor}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => {
          setIsChatModalOpen(false);
          setSelectedMentor(null);
        }}
        mentorUserId={selectedMentor?.userId}
        mentorName={selectedMentor?.name}
        mentorId={selectedMentor?._id}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedMentor(null);
        }}
        mentor={selectedMentor}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default Community;