import React, { useState } from 'react';
import { 
  School, 
  Search, 
  Filter,
  MapPin,
  Star,
  DollarSign,
  Users,
  Calendar,
  ExternalLink,
  Bookmark,
  Phone,
  Globe,
  Award,
  BookOpen
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const CollegeFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const colleges = [
    {
      id: 1,
      name: 'Indian Institute of Technology, Delhi',
      type: 'Government',
      state: 'Delhi',
      city: 'New Delhi',
      rating: 4.8,
      fees: '₹2,50,000/year',
      courses: ['B.Tech', 'M.Tech', 'PhD'],
      students: 8000,
      established: 1961,
      ranking: '#2 Engineering',
      website: 'https://iitd.ac.in',
      phone: '+91-11-2659-1938',
      image: '🏛️',
      facilities: ['Library', 'Hostel', 'Labs', 'Sports Complex'],
      placementRate: 95,
      avgPackage: '₹15 LPA'
    },
    {
      id: 2,
      name: 'Jawaharlal Nehru University',
      type: 'Government',
      state: 'Delhi',
      city: 'New Delhi',
      rating: 4.6,
      fees: '₹50,000/year',
      courses: ['BA', 'MA', 'MSc', 'PhD'],
      students: 12000,
      established: 1969,
      ranking: '#3 University',
      website: 'https://jnu.ac.in',
      phone: '+91-11-2670-4500',
      image: '🎓',
      facilities: ['Library', 'Hostel', 'Research Centers'],
      placementRate: 78,
      avgPackage: '₹8 LPA'
    },
    {
      id: 3,
      name: 'University of Delhi',
      type: 'Government',
      state: 'Delhi',
      city: 'New Delhi',
      rating: 4.5,
      fees: '₹30,000/year',
      courses: ['BA', 'BSc', 'BCom', 'MA', 'MSc'],
      students: 300000,
      established: 1922,
      ranking: '#12 University',
      website: 'https://du.ac.in',
      phone: '+91-11-2766-7049',
      image: '🏫',
      facilities: ['Multiple Colleges', 'Library', 'Sports'],
      placementRate: 65,
      avgPackage: '₹6 LPA'
    }
  ];

  const states = [
    'all', 'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 
    'Karnataka', 'Kerala', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh'
  ];

  const courses = [
    'all', 'B.Tech', 'B.Sc', 'BA', 'BCom', 'BBA', 'M.Tech', 'MBA', 'MSc', 'MA'
  ];

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'all' || college.state === selectedState;
    const matchesCourse = selectedCourse === 'all' || college.courses.includes(selectedCourse);
    const matchesType = selectedType === 'all' || college.type === selectedType;
    
    return matchesSearch && matchesState && matchesCourse && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Government College & Course Finder</h1>
              <p className="text-gray-600">Search, filter, and compare nearby government colleges</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All States</option>
              {states.slice(1).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Courses</option>
              {courses.slice(1).map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Deemed">Deemed University</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredColleges.map((college) => (
            <div key={college.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                      {college.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{college.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{college.city}, {college.state}</span>
                      </div>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {college.type}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-bold text-gray-900">{college.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{college.ranking}</p>
                    <p className="text-xs text-gray-500">Ranking</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{college.established}</p>
                    <p className="text-xs text-gray-500">Established</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Fees</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{college.fees}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Students</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{college.students.toLocaleString()}</p>
                  </div>
                </div>

                {/* Courses */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Courses Offered</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {college.courses.map((course, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Facilities</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {college.facilities.map((facility, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Placement Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-xs text-green-600 font-medium">Placement Rate</p>
                    <p className="text-sm font-bold text-green-800">{college.placementRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600 font-medium">Average Package</p>
                    <p className="text-sm font-bold text-green-800">{college.avgPackage}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Globe className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600">Try adjusting your search filters to find more colleges.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeFinder;