import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building,
  BookOpen,
  ExternalLink,
  Bookmark,
  TrendingUp,
  Users,
  Award,
  Calendar
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const JobAgent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedSalary, setSelectedSalary] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Innovations Pvt Ltd',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '1-3 years',
      salary: '₹4-8 LPA',
      postedDate: '2024-01-15',
      deadline: '2024-02-15',
      description: 'We are looking for a skilled Frontend Developer to join our dynamic team...',
      requirements: ['React.js', 'JavaScript', 'HTML/CSS', 'Git'],
      benefits: ['Health Insurance', 'Remote Work', 'Learning Budget'],
      applicants: 45,
      isBookmarked: false,
      isRemote: true,
      companySize: '50-200',
      industry: 'Technology'
    },
    {
      id: 2,
      title: 'Data Analyst',
      company: 'Analytics Solutions India',
      location: 'Mumbai',
      type: 'Full-time',
      experience: '0-2 years',
      salary: '₹3-6 LPA',
      postedDate: '2024-01-18',
      deadline: '2024-02-20',
      description: 'Join our data team to help organizations make data-driven decisions...',
      requirements: ['Python', 'SQL', 'Excel', 'Tableau'],
      benefits: ['Flexible Hours', 'Professional Development', 'Performance Bonus'],
      applicants: 78,
      isBookmarked: true,
      isRemote: false,
      companySize: '200-500',
      industry: 'Consulting'
    },
    {
      id: 3,
      title: 'Digital Marketing Executive',
      company: 'Creative Media House',
      location: 'Delhi',
      type: 'Full-time',
      experience: '1-2 years',
      salary: '₹3-5 LPA',
      postedDate: '2024-01-20',
      deadline: '2024-02-25',
      description: 'Looking for a creative and analytical digital marketing professional...',
      requirements: ['Social Media Marketing', 'Google Ads', 'SEO', 'Content Creation'],
      benefits: ['Creative Environment', 'Growth Opportunities', 'Team Outings'],
      applicants: 32,
      isBookmarked: false,
      isRemote: true,
      companySize: '10-50',
      industry: 'Marketing'
    },
    {
      id: 4,
      title: 'Junior Software Engineer',
      company: 'Global Tech Solutions',
      location: 'Hyderabad',
      type: 'Full-time',
      experience: '0-1 years',
      salary: '₹3.5-6 LPA',
      postedDate: '2024-01-22',
      deadline: '2024-03-01',
      description: 'Entry-level position for fresh graduates in software development...',
      requirements: ['Java', 'Spring Boot', 'MySQL', 'Problem Solving'],
      benefits: ['Training Program', 'Mentorship', 'Career Growth'],
      applicants: 156,
      isBookmarked: false,
      isRemote: false,
      companySize: '1000+',
      industry: 'Technology'
    }
  ];

  const locations = ['all', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
  const experienceLevels = ['all', '0-1 years', '1-3 years', '3-5 years', '5+ years'];
  const salaryRanges = ['all', '2-4 LPA', '4-8 LPA', '8-12 LPA', '12+ LPA'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesExperience = selectedExperience === 'all' || job.experience === selectedExperience;
    return matchesSearch && matchesLocation && matchesExperience;
  });

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getDaysLeft = (deadlineString) => {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffTime = deadline - now;
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Google ADK-Powered Job Agent</h1>
              <p className="text-gray-600">Discover job opportunities curated by advanced AI algorithms</p>
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
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Locations</option>
              {locations.slice(1).map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Experience</option>
              {experienceLevels.slice(1).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            
            <select
              value={selectedSalary}
              onChange={(e) => setSelectedSalary(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Salaries</option>
              {salaryRanges.slice(1).map(range => (
                <option key={range} value={range}>₹{range}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      {job.isRemote && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Remote
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Award className="w-4 h-4" />
                        <span>{job.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className={`text-gray-400 hover:text-red-500 transition-colors ${job.isBookmarked ? 'text-red-500' : ''}`}>
                      <Bookmark className={`w-6 h-6 ${job.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 text-sm">{job.description}</p>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Requirements</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, index) => (
                          <span key={index} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Company Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Company Size</h4>
                        <p className="text-sm text-gray-700">{job.companySize} employees</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Industry</h4>
                        <p className="text-sm text-gray-700">{job.industry}</p>
                      </div>
                    </div>

                    {/* Application Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <h4 className="font-semibold text-gray-900">Applicants</h4>
                        </div>
                        <p className="text-sm text-gray-700">{job.applicants} applied</p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <h4 className="font-semibold text-gray-900">Deadline</h4>
                        </div>
                        <p className="text-sm text-gray-700">{getDaysLeft(job.deadline)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100">
                  <span>Posted {getTimeAgo(job.postedDate)}</span>
                  <span className={getDaysLeft(job.deadline) === 'Today' || getDaysLeft(job.deadline) === 'Tomorrow' ? 'text-red-600 font-medium' : ''}>
                    Apply by {job.deadline}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 mt-6">
                  <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                    <span>Apply Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    View Company
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search filters to find more opportunities.</p>
          </div>
        )}

        {/* AI Agent Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900">AI-Powered Job Matching</h3>
          </div>
          <p className="text-blue-800 text-sm mb-3">
            Our Google ADK-powered AI agent analyzes your profile, skills, and preferences to find the most relevant job opportunities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div>• Real-time job market analysis</div>
            <div>• Personalized job recommendations</div>
            <div>• Salary and growth predictions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAgent;