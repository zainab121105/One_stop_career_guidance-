import React, { useState, useEffect } from 'react';
import { School, Search, MapPin, ExternalLink, Bookmark, Phone, Globe, AlertCircle, Loader2 } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const CollegeFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API configuration
  const API_KEY = '579b464db66ec23bdd000001aa62979bc84546ae6ee84ae51ce0db09';
  const API_ENDPOINT = `https://api.data.gov.in/resource/bd319d74-c98a-4e7e-b8d6-dc88053a6a3b?api-key=${API_KEY}&format=json&limit=500`;

  // Location extraction with defensive programming
  const extractLocation = (name) => {
    if (!name) return { city: 'Unknown City', state: 'Unknown State' };
    
    try {
      const lowerName = name.toLowerCase();
      const locations = {
        'bangalore': { city: 'Bangalore', state: 'Karnataka' },
        'bengaluru': { city: 'Bangalore', state: 'Karnataka' },
        'mumbai': { city: 'Mumbai', state: 'Maharashtra' },
        'pune': { city: 'Pune', state: 'Maharashtra' },
        'chennai': { city: 'Chennai', state: 'Tamil Nadu' },
        'delhi': { city: 'Delhi', state: 'Delhi' },
        'kolkata': { city: 'Kolkata', state: 'West Bengal' },
        'hyderabad': { city: 'Hyderabad', state: 'Telangana' },
        'karnataka': { city: 'Various Cities', state: 'Karnataka' },
        'maharashtra': { city: 'Various Cities', state: 'Maharashtra' },
        'tamil nadu': { city: 'Various Cities', state: 'Tamil Nadu' }
      };

      for (const [key, location] of Object.entries(locations)) {
        if (lowerName.includes(key)) {
          return location;
        }
      }
      
      return { city: 'Unknown City', state: 'Unknown State' };
    } catch (error) {
      console.error('Error extracting location:', error);
      return { city: 'Unknown City', state: 'Unknown State' };
    }
  };

  // Course inference with defensive programming  
  const inferCourses = (college) => {
    if (!college) return ['General'];
    
    try {
      const name = (college.title || college.name || '').toLowerCase();
      const courseKeywords = {
        'Engineering': ['engineering', 'technical', 'technology'],
        'Medical': ['medical', 'medicine', 'dental'], 
        'Management': ['management', 'mba', 'business'],
        'Arts': ['arts', 'humanities'],
        'Science': ['science', 'physics', 'chemistry']
      };
      
      const detectedCourses = [];
      Object.entries(courseKeywords).forEach(([course, keywords]) => {
        if (keywords && keywords.some && keywords.some(keyword => name.includes(keyword))) {
          detectedCourses.push(course);
        }
      });
      
      return detectedCourses.length > 0 ? detectedCourses : ['General'];
    } catch (error) {
      console.error('Error inferring courses:', error);
      return ['General'];
    }
  };

  // Fetch colleges from API
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching colleges...');
        
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data || !Array.isArray(data.records)) {
          throw new Error('Invalid API response structure');
        }
        
        const collegesData = data.records;
        console.log(`Processing ${collegesData.length} colleges`);
        
        const processedColleges = collegesData.map((college, index) => {
          try {
            const location = extractLocation(college?.title || college?.name || '');
            const courses = inferCourses(college);
            
            return {
              id: college?.id || index,
              name: college?.title || college?.name || 'Unknown College',
              city: location.city,
              state: location.state,
              type: college?.type || 'Unknown',
              courses: courses,
              website: college?.website || '',
              phone: college?.phone || ''
            };
          } catch (error) {
            console.error(`Error processing college ${index}:`, error);
            return {
              id: index,
              name: 'Processing Error',
              city: 'Unknown City', 
              state: 'Unknown State',
              type: 'Unknown',
              courses: ['General'],
              website: '',
              phone: ''
            };
          }
        });
        
        setColleges(processedColleges);
        console.log('Colleges processed successfully');
        
      } catch (error) {
        console.error('Error fetching colleges:', error);
        setError('Failed to fetch college data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Get unique values with defensive programming
  const getUniqueStates = () => {
    try {
      if (!Array.isArray(colleges) || colleges.length === 0) return [];
      const statesSet = new Set();
      colleges.forEach(college => {
        if (college?.state && college.state !== 'Unknown State') {
          statesSet.add(college.state);
        }
      });
      return Array.from(statesSet).sort();
    } catch (error) {
      console.error('Error getting unique states:', error);
      return [];
    }
  };

  const getUniqueCourses = () => {
    try {
      if (!Array.isArray(colleges) || colleges.length === 0) return [];
      const coursesSet = new Set();
      colleges.forEach(college => {
        if (Array.isArray(college?.courses)) {
          college.courses.forEach(course => {
            if (course && course !== 'General') {
              coursesSet.add(course);
            }
          });
        }
      });
      return Array.from(coursesSet).sort();
    } catch (error) {
      console.error('Error getting unique courses:', error);
      return [];
    }
  };

  const getUniqueTypes = () => {
    try {
      if (!Array.isArray(colleges) || colleges.length === 0) return [];
      const typesSet = new Set();
      colleges.forEach(college => {
        if (college?.type && college.type !== 'Unknown') {
          typesSet.add(college.type);
        }
      });
      return Array.from(typesSet).sort();
    } catch (error) {
      console.error('Error getting unique types:', error);
      return [];
    }
  };

  // Filter colleges with comprehensive defensive programming
  const getFilteredColleges = () => {
    try {
      if (!Array.isArray(colleges) || colleges.length === 0) {
        return [];
      }

      let filtered = [...colleges];
      console.log('Starting filter with', filtered.length, 'colleges');

      // Search filter
      if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(college => {
          try {
            const name = college?.name || '';
            const city = college?.city || '';
            const state = college?.state || '';
            const courses = college?.courses || [];
            
            return name.toLowerCase().includes(searchLower) ||
                   city.toLowerCase().includes(searchLower) ||
                   state.toLowerCase().includes(searchLower) ||
                   (Array.isArray(courses) && courses.some(course => 
                     course && typeof course === 'string' && course.toLowerCase().includes(searchLower)));
          } catch (error) {
            console.error('Error in search filter:', error);
            return false;
          }
        });
        console.log('After search filter:', filtered.length, 'colleges');
      }

      // State filter
      if (selectedState && selectedState !== 'all') {
        filtered = filtered.filter(college => {
          try {
            return college?.state === selectedState;
          } catch (error) {
            console.error('Error in state filter:', error);
            return false;
          }
        });
        console.log('After state filter:', filtered.length, 'colleges');
      }

      // Course filter
      if (selectedCourse && selectedCourse !== 'all') {
        filtered = filtered.filter(college => {
          try {
            const courses = college?.courses || [];
            return Array.isArray(courses) && courses.includes(selectedCourse);
          } catch (error) {
            console.error('Error in course filter:', error);
            return false;
          }
        });
        console.log('After course filter:', filtered.length, 'colleges');
      }

      // Type filter
      if (selectedType && selectedType !== 'all') {
        filtered = filtered.filter(college => {
          try {
            return college?.type === selectedType;
          } catch (error) {
            console.error('Error in type filter:', error);
            return false;
          }
        });
        console.log('After type filter:', filtered.length, 'colleges');
      }

      console.log('Final filtered colleges:', filtered.length);
      return filtered;

    } catch (error) {
      console.error('Critical error in filtering:', error);
      return [];
    }
  };

  const filteredColleges = getFilteredColleges();

  // Reset filters
  const resetFilters = () => {
    try {
      setSearchTerm('');
      setSelectedState('all');
      setSelectedCourse('all');
      setSelectedType('all');
      console.log('Filters reset');
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  };

  // Handle filter changes with defensive programming
  const handleStateChange = (e) => {
    try {
      const value = e?.target?.value;
      if (typeof value === 'string') {
        console.log('State changed to:', value);
        setSelectedState(value);
      }
    } catch (error) {
      console.error('Error in handleStateChange:', error);
    }
  };

  const handleCourseChange = (e) => {
    try {
      const value = e?.target?.value;
      if (typeof value === 'string') {
        console.log('Course changed to:', value);
        setSelectedCourse(value);
      }
    } catch (error) {
      console.error('Error in handleCourseChange:', error);
    }
  };

  const handleTypeChange = (e) => {
    try {
      const value = e?.target?.value;
      if (typeof value === 'string') {
        console.log('Type changed to:', value);
        setSelectedType(value);
      }
    } catch (error) {
      console.error('Error in handleTypeChange:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Loading Colleges...</h2>
                <p className="text-gray-500 mt-2">Fetching the latest college data for you</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <DashboardNavbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Error Loading Data</h2>
                <p className="text-gray-500 mt-2">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Find Your Perfect College
            </h1>
            <p className="text-xl text-gray-600">
              Discover top colleges and universities across India
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search colleges by name, location, or course..."
                value={searchTerm}
                onChange={(e) => {
                  try {
                    setSearchTerm(e.target.value || '');
                  } catch (error) {
                    console.error('Error updating search term:', error);
                  }
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All States</option>
                  {getUniqueStates().map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Course Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Courses</option>
                  {getUniqueCourses().map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {getUniqueTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="text-sm text-gray-600">
              Showing {filteredColleges.length} of {colleges.length} colleges
              {selectedState !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  State: {selectedState}
                </span>
              )}
              {selectedCourse !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded">
                  Course: {selectedCourse}
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded">
                  Type: {selectedType}
                </span>
              )}
            </div>
          </div>

          {/* Results */}
          {filteredColleges.length === 0 ? (
            <div className="text-center py-12">
              <School className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No colleges found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college) => {
                try {
                  return (
                    <div
                      key={college?.id || Math.random()}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
                    >
                      {/* College Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                            {college?.name || 'Unknown College'}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {college?.city || 'Unknown'}, {college?.state || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        <Bookmark className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                      </div>

                      {/* College Details */}
                      <div className="space-y-3">
                        {/* Type */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Type:</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {college?.type || 'Unknown'}
                          </span>
                        </div>

                        {/* Courses */}
                        <div>
                          <span className="text-sm text-gray-600 block mb-2">Courses:</span>
                          <div className="flex flex-wrap gap-1">
                            {(college?.courses || []).slice(0, 3).map((course, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                              >
                                {course}
                              </span>
                            ))}
                            {college?.courses && college.courses.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{college.courses.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Contact Info */}
                        {college?.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span className="text-sm">{college.phone}</span>
                          </div>
                        )}

                        {college?.website && (
                          <div className="flex items-center text-gray-600">
                            <Globe className="w-4 h-4 mr-2" />
                            <a
                              href={college.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          View Details
                        </button>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                } catch (error) {
                  console.error('Error rendering college card:', error);
                  return (
                    <div
                      key={Math.random()}
                      className="bg-white rounded-xl shadow-lg p-6"
                    >
                      <div className="text-center text-red-500">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm">Error displaying college</span>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CollegeFinder;
