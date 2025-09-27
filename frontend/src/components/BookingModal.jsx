import React, { useState } from 'react';
import { X, Calendar, Clock, Video, Phone, MessageCircle, User, CheckCircle, Plus } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose, mentor, onBookingSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('booking'); // 'booking' or 'success'
  const [bookingDetails, setBookingDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    // Session Details
    sessionDate: '',
    sessionTime: '',
    duration: '60',
    sessionType: 'video-call',
    
    // Topics
    topics: [],
    customTopic: '',
    
    // User Details
    fullName: user?.name || '',
    email: user?.email || '',
    phoneNumber: '',
    
    // Session Preferences
    experience: '',
    currentRole: '',
    goals: '',
    specificQuestions: '',
    
    // Backup Options
    alternateDate: '',
    alternateTime: '',
    
    // Additional Info
    specialRequirements: ''
  });

  const sessionTopics = [
    'Career Guidance',
    'Resume Review',
    'Interview Preparation',
    'Skill Development',
    'Industry Insights',
    'Job Search Strategy',
    'Networking Tips',
    'Salary Negotiation',
    'Career Transition',
    'Leadership Development',
    'Work-Life Balance',
    'Professional Growth'
  ];

  const experienceLevels = [
    'Student',
    'Fresh Graduate',
    '1-2 years',
    '3-5 years',
    '5-10 years',
    '10+ years'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopicToggle = (topic) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const addCustomTopic = () => {
    if (formData.customTopic.trim() && !formData.topics.includes(formData.customTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, prev.customTopic.trim()],
        customTopic: ''
      }));
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  };

  const getMinTime = () => {
    const selectedDate = new Date(formData.sessionDate);
    const today = new Date();
    
    if (selectedDate.toDateString() === today.toDateString()) {
      const minTime = new Date(today.getTime() + 2 * 60 * 60 * 1000);
      return minTime.toTimeString().slice(0, 5);
    }
    
    return '09:00';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validation
    if (!formData.sessionDate || !formData.sessionTime) {
      alert('Please select a session date and time');
      return;
    }

    if (!formData.phoneNumber) {
      alert('Please provide your phone number');
      return;
    }

    if (formData.topics.length === 0) {
      alert('Please select at least one topic for discussion');
      return;
    }

    try {
      setLoading(true);
      
      const sessionDateTime = new Date(`${formData.sessionDate}T${formData.sessionTime}`);
      
      const bookingData = {
        sessionDate: sessionDateTime.toISOString(),
        duration: parseInt(formData.duration),
        sessionType: formData.sessionType,
        topics: formData.topics,
        userDetails: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          experience: formData.experience,
          currentRole: formData.currentRole,
          goals: formData.goals,
          specificQuestions: formData.specificQuestions,
          specialRequirements: formData.specialRequirements
        },
        backupOptions: formData.alternateDate && formData.alternateTime ? {
          alternateDate: new Date(`${formData.alternateDate}T${formData.alternateTime}`).toISOString()
        } : null
      };
      
      const response = await api.post(`/mentors/${mentor._id}/book`, bookingData);

      if (response.data && response.data.session) {
        setBookingDetails(response.data.session);
        setStep('success');
        onBookingSuccess?.(response.data.session);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error booking session:', error);
      alert(error.response?.data?.message || 'Failed to book session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('booking');
    setFormData({
      sessionDate: '',
      sessionTime: '',
      duration: '60',
      sessionType: 'video-call',
      topics: [],
      customTopic: '',
      fullName: user?.name || '',
      email: user?.email || '',
      phoneNumber: '',
      experience: '',
      currentRole: '',
      goals: '',
      specificQuestions: '',
      alternateDate: '',
      alternateTime: '',
      specialRequirements: ''
    });
    setBookingDetails(null);
    onClose();
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionTypeIcon = (sessionType) => {
    switch (sessionType) {
      case 'video-call':
        return <Video className="w-4 h-4 text-gray-600" />;
      case 'phone-call':
        return <Phone className="w-4 h-4 text-gray-600" />;
      case 'chat':
        return <MessageCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!isOpen || !mentor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {mentor.availability === 'Available' ? 'Book Session' : 'Request Session'}
            </h3>
            <p className="text-gray-500">
              {mentor.availability === 'Available' 
                ? 'Schedule your mentorship session' 
                : 'Submit a session request for mentor approval'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {step === 'booking' ? (
          // Booking Form
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mentor Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{mentor.name}</h4>
                    <p className="text-sm text-gray-600">{mentor.title} at {mentor.company}</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        mentor.availability === 'Available' 
                          ? 'bg-green-400' 
                          : mentor.availability === 'Busy'
                          ? 'bg-orange-400'
                          : 'bg-gray-400'
                      }`}></span>
                      <span className={`text-xs font-medium ${
                        mentor.availability === 'Available' 
                          ? 'text-green-600' 
                          : mentor.availability === 'Busy'
                          ? 'text-orange-600'
                          : 'text-gray-600'
                      }`}>
                        {mentor.availability}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{mentor.price?.amount || 0}/hour</p>
                    <p className="text-sm text-gray-500">{mentor.experience}</p>
                  </div>
                </div>
                
                {/* Availability Notice */}
                {mentor.availability !== 'Available' && (
                  <div className={`mt-3 p-3 rounded-lg ${
                    mentor.availability === 'Busy' 
                      ? 'bg-orange-50 border border-orange-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <p className={`text-sm ${
                      mentor.availability === 'Busy' 
                        ? 'text-orange-800' 
                        : 'text-gray-700'
                    }`}>
                      <strong>Note:</strong> {mentor.availability === 'Busy' 
                        ? 'This mentor is currently busy. Your session request will be sent for approval and the mentor will confirm the timing.' 
                        : 'This mentor is currently away. Your session request will be sent and the mentor will respond when available.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h5 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Experience</option>
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Role/Position
                  </label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Developer, Marketing Manager, Student"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-4">
                <h5 className="text-lg font-medium text-gray-900 border-b pb-2">Session Details</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="sessionDate"
                      value={formData.sessionDate}
                      onChange={handleInputChange}
                      min={getMinDateTime()}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Preferred Time *
                    </label>
                    <input
                      type="time"
                      name="sessionTime"
                      value={formData.sessionTime}
                      onChange={handleInputChange}
                      min={formData.sessionDate === new Date().toISOString().slice(0, 10) ? getMinTime() : '09:00'}
                      max="22:00"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Type
                    </label>
                    <select
                      name="sessionType"
                      value={formData.sessionType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="video-call">Video Call</option>
                      <option value="phone-call">Phone Call</option>
                      <option value="chat">Chat Session</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div className="space-y-4">
                <h5 className="text-lg font-medium text-gray-900 border-b pb-2">Topics of Discussion *</h5>
                
                <div className="grid grid-cols-2 gap-2">
                  {sessionTopics.map(topic => (
                    <label key={topic} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.topics.includes(topic)}
                        onChange={() => handleTopicToggle(topic)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{topic}</span>
                    </label>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="customTopic"
                    value={formData.customTopic}
                    onChange={handleInputChange}
                    placeholder="Add custom topic..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomTopic}
                    className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {formData.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.topics.map(topic => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{topic}</span>
                        <button
                          type="button"
                          onClick={() => handleTopicToggle(topic)}
                          className="ml-1 hover:text-primary-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h5 className="text-lg font-medium text-gray-900 border-b pb-2">Additional Information</h5>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What do you hope to achieve from this session?
                  </label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe your goals and expectations..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specific Questions or Topics
                  </label>
                  <textarea
                    name="specificQuestions"
                    value={formData.specificQuestions}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any specific questions you'd like to discuss..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } text-white`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{mentor.availability === 'Available' ? 'Booking...' : 'Requesting...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{mentor.availability === 'Available' ? 'Book Session' : 'Request Session'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Success Screen
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {mentor.availability === 'Available' 
                ? 'Session Booked Successfully!' 
                : 'Session Request Submitted!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {mentor.availability === 'Available' 
                ? 'Your session has been confirmed. Details below:' 
                : 'Your session request has been sent to the mentor. They will confirm the timing soon.'}
            </p>

            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Mentor:</span>
                <span className="text-sm text-gray-900">{mentor.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Date & Time:</span>
                <span className="text-sm text-gray-900">{formatDateTime(bookingDetails?.sessionDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Duration:</span>
                <span className="text-sm text-gray-900">{bookingDetails?.duration} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Session Type:</span>
                <div className="flex items-center space-x-2">
                  {getSessionTypeIcon(bookingDetails?.sessionType)}
                  <span className="text-sm text-gray-900 capitalize">
                    {bookingDetails?.sessionType?.replace('-', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Cost:</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{Math.round((mentor.price?.amount || 0) * (bookingDetails?.duration / 60))}
                </span>
              </div>
              {bookingDetails?.topics && bookingDetails.topics.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Topics:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {bookingDetails.topics.map((topic, index) => (
                      <span key={index} className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>What's next?</strong> 
                {mentor.availability === 'Available' 
                  ? ' You will receive a confirmation email with session details and meeting link. The mentor will also be notified about this booking.' 
                  : ' You will receive an email notification once the mentor reviews and confirms your session request. The mentor has been notified about your request.'}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;