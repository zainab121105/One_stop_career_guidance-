import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  ExternalLink,
  Bookmark,
  Users,
  Award
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const Scholarships = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAmount, setSelectedAmount] = useState('all');

  const scholarships = [
    {
      id: 1,
      title: 'National Merit Scholarship',
      provider: 'Government of India',
      amount: '₹50,000 - ₹2,00,000',
      category: 'merit',
      deadline: '2024-03-15',
      eligibility: 'Class 12 passed with 90%+ marks',
      description: 'Merit-based scholarship for outstanding academic performance.',
      location: 'All India',
      applicants: 15000,
      awarded: 500,
      type: 'government',
      bookmarked: false
    },
    {
      id: 2,
      title: 'Post Matric Scholarship for SC/ST',
      provider: 'Ministry of Social Justice',
      amount: '₹20,000 - ₹1,20,000',
      category: 'reserved',
      deadline: '2024-04-20',
      eligibility: 'SC/ST students pursuing higher education',
      description: 'Financial assistance for SC/ST students in higher education.',
      location: 'All India',
      applicants: 25000,
      awarded: 8000,
      type: 'government',
      bookmarked: true
    },
    {
      id: 3,
      title: 'Women in STEM Scholarship',
      provider: 'Tech Foundation',
      amount: '₹1,00,000',
      category: 'women',
      deadline: '2024-05-10',
      eligibility: 'Female students in STEM fields',
      description: 'Encouraging women to pursue careers in Science, Technology, Engineering, and Mathematics.',
      location: 'All India',
      applicants: 3000,
      awarded: 100,
      type: 'private',
      bookmarked: false
    },
    {
      id: 4,
      title: 'Rural Development Scholarship',
      provider: 'Rural Development Ministry',
      amount: '₹25,000 - ₹75,000',
      category: 'rural',
      deadline: '2024-03-30',
      eligibility: 'Students from rural areas',
      description: 'Supporting education for students from rural backgrounds.',
      location: 'Rural Areas',
      applicants: 12000,
      awarded: 2000,
      type: 'government',
      bookmarked: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'merit', name: 'Merit Based' },
    { id: 'reserved', name: 'SC/ST/OBC' },
    { id: 'women', name: 'Women' },
    { id: 'rural', name: 'Rural Students' },
    { id: 'minority', name: 'Minority' }
  ];

  const amountRanges = [
    { id: 'all', name: 'All Amounts' },
    { id: 'low', name: 'Under ₹50,000' },
    { id: 'medium', name: '₹50,000 - ₹1,00,000' },
    { id: 'high', name: 'Above ₹1,00,000' }
  ];

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scholarship.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'merit': return 'bg-blue-100 text-blue-700';
      case 'reserved': return 'bg-green-100 text-green-700';
      case 'women': return 'bg-pink-100 text-pink-700';
      case 'rural': return 'bg-yellow-100 text-yellow-700';
      case 'minority': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type) => {
    return type === 'government' ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200';
  };

  const formatDeadline = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scholarships & Government Schemes</h1>
              <p className="text-gray-600">Discover financial assistance opportunities for your education</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {amountRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship) => (
            <div key={scholarship.id} className={`bg-white rounded-xl shadow-sm border-2 ${getTypeColor(scholarship.type)} overflow-hidden hover:shadow-lg transition-shadow`}>
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{scholarship.title}</h3>
                    <p className="text-sm text-gray-600">{scholarship.provider}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(scholarship.category)}`}>
                      {scholarship.category}
                    </span>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Bookmark className={`w-5 h-5 ${scholarship.bookmarked ? 'text-red-500 fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">{scholarship.amount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{scholarship.location}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 text-sm mb-4">{scholarship.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Eligibility</span>
                    <p className="text-sm text-gray-700">{scholarship.eligibility}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Applicants</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{scholarship.applicants.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Awarded</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{scholarship.awarded.toLocaleString()}</p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Deadline</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-800">{scholarship.deadline}</p>
                    <p className="text-xs text-yellow-600">{formatDeadline(scholarship.deadline)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                    <span>Apply Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No scholarships found</h3>
            <p className="text-gray-600">Try adjusting your search filters to find more opportunities.</p>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Application Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>• Start applications early to avoid last-minute rush</div>
            <div>• Keep all required documents ready</div>
            <div>• Read eligibility criteria carefully</div>
            <div>• Apply to multiple scholarships to increase chances</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scholarships;