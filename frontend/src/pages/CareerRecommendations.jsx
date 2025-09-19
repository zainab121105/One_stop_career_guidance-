import React, { useState } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  Star,
  MapPin,
  DollarSign,
  Clock,
  Users,
  BookOpen,
  Award,
  Filter,
  Search,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const CareerRecommendations = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const recommendations = [
    {
      id: 1,
      title: 'Data Scientist',
      matchPercentage: 92,
      category: 'Technology',
      description: 'Analyze complex data to help organizations make informed decisions.',
      avgSalary: '₹8-15 LPA',
      growth: 'High',
      location: 'Bangalore, Mumbai, Delhi',
      companies: ['Google', 'Microsoft', 'Amazon', 'Flipkart'],
      skillsRequired: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
      education: "Bachelor's in Computer Science/Statistics/Math",
      experience: '0-2 years',
      pros: ['High demand', 'Excellent salary', 'Innovative work'],
      cons: ['Steep learning curve', 'Requires continuous upskilling'],
      jobCount: 2500,
      trending: true
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      matchPercentage: 88,
      category: 'Technology',
      description: 'Build complete web applications from frontend to backend.',
      avgSalary: '₹6-12 LPA',
      growth: 'Very High',
      location: 'Pune, Hyderabad, Chennai',
      companies: ['TCS', 'Infosys', 'Wipro', 'Accenture'],
      skillsRequired: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
      education: "Bachelor's in Computer Science/IT",
      experience: '0-3 years',
      pros: ['Versatile skills', 'Remote work options', 'High job availability'],
      cons: ['Need to learn multiple technologies', 'Fast-changing landscape'],
      jobCount: 4200,
      trending: true
    },
    {
      id: 3,
      title: 'Digital Marketing Manager',
      matchPercentage: 85,
      category: 'Marketing',
      description: 'Plan and execute digital marketing strategies across various channels.',
      avgSalary: '₹5-10 LPA',
      growth: 'High',
      location: 'Mumbai, Delhi, Bangalore',
      companies: ['Unilever', 'P&G', 'HUL', 'Zomato'],
      skillsRequired: ['SEO', 'Social Media', 'Analytics', 'Content Marketing'],
      education: "Bachelor's in Marketing/Business/Communications",
      experience: '1-4 years',
      pros: ['Creative work', 'Diverse opportunities', 'Growing field'],
      cons: ['Performance pressure', 'Constant algorithm changes'],
      jobCount: 1800,
      trending: false
    },
    {
      id: 4,
      title: 'Product Manager',
      matchPercentage: 82,
      category: 'Management',
      description: 'Drive product strategy and development from conception to launch.',
      avgSalary: '₹10-20 LPA',
      growth: 'Very High',
      location: 'Bangalore, Mumbai, Gurgaon',
      companies: ['Flipkart', 'Paytm', 'Ola', 'Swiggy'],
      skillsRequired: ['Strategy', 'Analytics', 'Communication', 'Leadership'],
      education: "Bachelor's in any field + MBA preferred",
      experience: '2-5 years',
      pros: ['Strategic role', 'High impact', 'Excellent career growth'],
      cons: ['High responsibility', 'Cross-functional challenges'],
      jobCount: 950,
      trending: true
    }
  ];

  const categories = [
    'all', 'Technology', 'Marketing', 'Management', 'Finance', 'Healthcare', 'Design'
  ];

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesCategory = selectedFilter === 'all' || rec.category === selectedFilter;
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100 border-green-300';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-gray-600 bg-gray-100 border-gray-300';
  };

  const getGrowthColor = (growth) => {
    switch (growth) {
      case 'Very High': return 'text-green-600 bg-green-100';
      case 'High': return 'text-blue-600 bg-blue-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI-Powered Career Recommendations</h1>
              <p className="text-gray-600">Personalized career suggestions based on your profile and market trends</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search career recommendations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          {filteredRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{recommendation.title}</h3>
                      {recommendation.trending && (
                        <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{recommendation.description}</p>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {recommendation.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`px-4 py-2 border-2 rounded-lg ${getMatchColor(recommendation.matchPercentage)}`}>
                      <div className="text-center">
                        <p className="text-lg font-bold">{recommendation.matchPercentage}%</p>
                        <p className="text-xs">Match</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Bookmark className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{recommendation.avgSalary}</p>
                      <p className="text-xs text-gray-500">Average Salary</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${getGrowthColor(recommendation.growth)}`}>
                        {recommendation.growth}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Growth</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Multiple Cities</p>
                      <p className="text-xs text-gray-500">Locations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{recommendation.jobCount}</p>
                      <p className="text-xs text-gray-500">Open Positions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Skills Required */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Skills Required</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.skillsRequired.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                        <Award className="w-4 h-4" />
                        <span>Education</span>
                      </h4>
                      <p className="text-sm text-gray-700">{recommendation.education}</p>
                    </div>

                    {/* Experience */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Experience Level</span>
                      </h4>
                      <p className="text-sm text-gray-700">{recommendation.experience}</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Top Companies */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Top Hiring Companies</h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.companies.map((company, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Pros</h4>
                        <ul className="space-y-1">
                          {recommendation.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">Considerations</h4>
                        <ul className="space-y-1">
                          {recommendation.cons.map((con, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-100">
                  <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                    <span>View Career Path</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    Find Jobs
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Get Skills Training
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations found</h3>
            <p className="text-gray-600">Try adjusting your search filters to see more career options.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerRecommendations;