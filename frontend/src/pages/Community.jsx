import React, { useState } from 'react';
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
  Award
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const Community = () => {
  const [activeTab, setActiveTab] = useState('mentors');
  const [searchTerm, setSearchTerm] = useState('');

  const mentors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      title: 'Senior Software Engineer',
      company: 'Google',
      experience: '12 years',
      expertise: ['Web Development', 'Data Science', 'Career Transition'],
      rating: 4.9,
      reviews: 156,
      location: 'Mumbai',
      availability: 'Available',
      price: '₹500/hour',
      image: '👩‍💼',
      bio: 'Helping students transition into tech careers with hands-on guidance.',
      languages: ['English', 'Hindi', 'Marathi']
    },
    {
      id: 2,
      name: 'Prof. Rajesh Kumar',
      title: 'IIT Professor',
      company: 'IIT Delhi',
      experience: '20 years',
      expertise: ['Engineering', 'Research', 'Academia'],
      rating: 4.8,
      reviews: 203,
      location: 'Delhi',
      availability: 'Busy',
      price: '₹800/hour',
      image: '👨‍🏫',
      bio: 'Experienced academic with expertise in engineering and research guidance.',
      languages: ['English', 'Hindi']
    },
    {
      id: 3,
      name: 'Ms. Anita Desai',
      title: 'Marketing Director',
      company: 'Unilever',
      experience: '15 years',
      expertise: ['Digital Marketing', 'Brand Management', 'Leadership'],
      rating: 4.7,
      reviews: 89,
      location: 'Bangalore',
      availability: 'Available',
      price: '₹600/hour',
      image: '👩‍💼',
      bio: 'Marketing expert with extensive experience in brand building and digital strategies.',
      languages: ['English', 'Hindi', 'Kannada']
    }
  ];

  const forumPosts = [
    {
      id: 1,
      title: 'How to prepare for GATE 2024?',
      author: 'Student123',
      category: 'Engineering',
      replies: 23,
      likes: 45,
      timeAgo: '2 hours ago',
      excerpt: 'Looking for effective preparation strategies for GATE exam...'
    },
    {
      id: 2,
      title: 'Career switch from IT to Data Science',
      author: 'TechGuru',
      category: 'Career Change',
      replies: 18,
      likes: 32,
      timeAgo: '4 hours ago',
      excerpt: 'What are the best ways to transition from software development to data science?'
    },
    {
      id: 3,
      title: 'Government job vs Private sector',
      author: 'ConfusedGraduate',
      category: 'Career Choice',
      replies: 56,
      likes: 78,
      timeAgo: '1 day ago',
      excerpt: 'Need guidance on choosing between government jobs and private sector opportunities...'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Career Guidance Workshop',
      date: '2024-02-15',
      time: '10:00 AM',
      type: 'Online',
      speaker: 'Dr. Priya Sharma',
      attendees: 45,
      maxAttendees: 100
    },
    {
      id: 2,
      title: 'Engineering Career Panel',
      date: '2024-02-20',
      time: '3:00 PM',
      type: 'Hybrid',
      speaker: 'Prof. Rajesh Kumar',
      attendees: 78,
      maxAttendees: 150
    }
  ];

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
                      {mentor.image}
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
                        <span className="text-sm font-bold text-gray-900">{mentor.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{mentor.reviews} reviews</p>
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
                      <span className="font-medium text-gray-900">{mentor.price}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                      <Video className="w-4 h-4" />
                      <span>Book Session</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Discussions</h2>
                  <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                    New Post
                  </button>
                </div>
                
                <div className="space-y-4">
                  {forumPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 hover:text-primary-600">{post.title}</h3>
                        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>by {post.author} • {post.timeAgo}</span>
                        <div className="flex items-center space-x-4">
                          <span>{post.replies} replies</span>
                          <span>{post.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Popular Categories</h3>
                <div className="space-y-2">
                  {['Engineering', 'Medical', 'Business', 'Arts', 'Science'].map((category) => (
                    <div key={category} className="flex justify-between items-center py-2">
                      <span className="text-gray-700">{category}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {Math.floor(Math.random() * 100)}
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
              <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600">by {event.speaker}</p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{event.time}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Attendees</span>
                      <span className="text-gray-900">{event.attendees}/{event.maxAttendees}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                    Register Now
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Event Categories</h3>
              <div className="space-y-3">
                {[
                  'Career Workshops',
                  'Industry Panels', 
                  'Skill Development',
                  'Networking Events',
                  'Mock Interviews'
                ].map((category) => (
                  <div key={category} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-700">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;