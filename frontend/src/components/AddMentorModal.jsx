import React, { useState } from 'react';
import { X, User, Briefcase, MapPin, DollarSign, Star, Clock } from 'lucide-react';

const AddMentorModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    bio: '',
    experience: '',
    expertise: '',
    languages: 'English',
    location: '',
    availability: 'Available',
    priceAmount: 50,
    priceCurrency: 'INR',
    profileImage: '',
    timezone: 'Asia/Kolkata',
    availableSlots: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({ day: '', startTime: '', endTime: '' });

  const experienceOptions = [
    '0-1 years',
    '1-3 years', 
    '3-5 years',
    '5-10 years',
    '10+ years'
  ];

  const dayOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const availabilityOptions = ['Available', 'Busy', 'Away'];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSlot = () => {
    if (currentSlot.day && currentSlot.startTime && currentSlot.endTime) {
      const newSlot = {
        day: currentSlot.day.toLowerCase(),
        startTime: currentSlot.startTime,
        endTime: currentSlot.endTime
      };
      
      // Check if slot already exists for this day
      const existingSlotIndex = formData.availableSlots.findIndex(
        slot => slot.day === newSlot.day
      );
      
      if (existingSlotIndex >= 0) {
        // Update existing slot
        const updatedSlots = [...formData.availableSlots];
        updatedSlots[existingSlotIndex] = newSlot;
        setFormData(prev => ({ ...prev, availableSlots: updatedSlots }));
      } else {
        // Add new slot
        setFormData(prev => ({
          ...prev,
          availableSlots: [...prev.availableSlots, newSlot]
        }));
      }
      
      setCurrentSlot({ day: '', startTime: '', endTime: '' });
    }
  };

  const handleRemoveSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.expertise.trim()) newErrors.expertise = 'Expertise is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.priceAmount < 0) newErrors.priceAmount = 'Price must be positive';
    if (formData.bio.length > 500) newErrors.bio = 'Bio must be less than 500 characters';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Format data for submission
      const mentorData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        company: formData.company.trim(),
        bio: formData.bio.trim(),
        experience: formData.experience,
        expertise: formData.expertise.split(',').map(skill => skill.trim()).filter(skill => skill),
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
        location: formData.location.trim(),
        availability: formData.availability,
        price: {
          amount: formData.priceAmount,
          currency: formData.priceCurrency
        },
        profileImage: formData.profileImage.trim(),
        schedule: {
          timezone: formData.timezone,
          availableSlots: formData.availableSlots
        }
      };

      await onSubmit(mentorData);
      
      // Reset form
      setFormData({
        name: '',
        title: '',
        company: '',
        bio: '',
        experience: '',
        expertise: '',
        languages: 'English',
        location: '',
        availability: 'Available',
        priceAmount: 50,
        priceCurrency: 'INR',
        profileImage: '',
        timezone: 'Asia/Kolkata',
        availableSlots: []
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding mentor:', error);
    }
    
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add New Mentor</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Senior Software Engineer"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Current company"
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select experience level</option>
                  {experienceOptions.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="City, Country"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {availabilityOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio (Max 500 characters)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.bio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description about yourself and your expertise..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                <p className="text-gray-500 text-sm ml-auto">{formData.bio.length}/500</p>
              </div>
            </div>
          </div>

          {/* Skills and Expertise */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Skills & Expertise</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expertise Areas * (comma-separated)
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.expertise ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., React, Node.js, Product Management"
                />
                {errors.expertise && <p className="text-red-500 text-sm mt-1">{errors.expertise}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., English, Hindi, Spanish"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate
                </label>
                <input
                  type="number"
                  name="priceAmount"
                  value={formData.priceAmount}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.priceAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.priceAmount && <p className="text-red-500 text-sm mt-1">{errors.priceAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="priceCurrency"
                  value={formData.priceCurrency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Schedule & Availability</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <select
                  value={currentSlot.day}
                  onChange={(e) => setCurrentSlot(prev => ({ ...prev, day: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select day</option>
                  {dayOptions.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={currentSlot.startTime}
                  onChange={(e) => setCurrentSlot(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={currentSlot.endTime}
                  onChange={(e) => setCurrentSlot(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Slot
                </button>
              </div>
            </div>

            {/* Display added slots */}
            {formData.availableSlots.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Available Slots:</h4>
                <div className="space-y-2">
                  {formData.availableSlots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span className="capitalize">
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Optional Profile Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Profile Image (Optional)</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding Mentor...</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span>Add Mentor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMentorModal;