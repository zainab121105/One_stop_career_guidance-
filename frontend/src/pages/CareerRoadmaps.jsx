import React, { useState } from 'react';
import { 
  Map, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Star,
  TrendingUp,
  Play,
  Download,
  Filter
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const CareerRoadmaps = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'technology', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'business', name: 'Business' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'arts', name: 'Arts & Design' }
  ];

  const roadmaps = [
    {
      id: 1,
      title: 'Full Stack Web Developer',
      category: 'technology',
      difficulty: 'intermediate',
      duration: '12-18 months',
      progress: 25,
      description: 'Complete roadmap to become a full-stack web developer with modern technologies.',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Database Design'],
      rating: 4.8,
      enrolledStudents: 1250,
      milestones: [
        { title: 'Frontend Basics', completed: true, duration: '2 months' },
        { title: 'JavaScript Mastery', completed: true, duration: '3 months' },
        { title: 'React Development', completed: false, duration: '4 months' },
        { title: 'Backend Development', completed: false, duration: '4 months' },
        { title: 'Full Stack Projects', completed: false, duration: '3 months' }
      ]
    },
    {
      id: 2,
      title: 'Data Science Professional',
      category: 'technology',
      difficulty: 'advanced',
      duration: '18-24 months',
      progress: 0,
      description: 'Comprehensive path to become a data scientist with machine learning expertise.',
      skills: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization', 'SQL'],
      rating: 4.9,
      enrolledStudents: 890,
      milestones: [
        { title: 'Python Programming', completed: false, duration: '3 months' },
        { title: 'Statistics & Math', completed: false, duration: '4 months' },
        { title: 'Data Analysis', completed: false, duration: '4 months' },
        { title: 'Machine Learning', completed: false, duration: '6 months' },
        { title: 'Advanced Projects', completed: false, duration: '5 months' }
      ]
    },
    {
      id: 3,
      title: 'Digital Marketing Specialist',
      category: 'business',
      difficulty: 'beginner',
      duration: '6-9 months',
      progress: 60,
      description: 'Learn digital marketing strategies and tools for modern businesses.',
      skills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics', 'PPC'],
      rating: 4.6,
      enrolledStudents: 2100,
      milestones: [
        { title: 'Marketing Fundamentals', completed: true, duration: '1 month' },
        { title: 'SEO & Content', completed: true, duration: '2 months' },
        { title: 'Social Media Marketing', completed: true, duration: '2 months' },
        { title: 'Analytics & Optimization', completed: false, duration: '2 months' },
        { title: 'Campaign Management', completed: false, duration: '2 months' }
      ]
    }
  ];

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const categoryMatch = selectedCategory === 'all' || roadmap.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || roadmap.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Career Roadmaps</h1>
              <p className="text-gray-600">Visual learning paths to guide your career journey</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Roadmaps</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredRoadmaps.map((roadmap) => (
            <div key={roadmap.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{roadmap.title}</h3>
                    <p className="text-gray-600 text-sm">{roadmap.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(roadmap.difficulty)}`}>
                    {roadmap.difficulty}
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{roadmap.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{roadmap.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{roadmap.enrolledStudents} enrolled</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {roadmap.progress > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">{roadmap.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${roadmap.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="p-6 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Skills You'll Learn</h4>
                <div className="flex flex-wrap gap-2">
                  {roadmap.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Learning Milestones</h4>
                <div className="space-y-3">
                  {roadmap.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        milestone.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {milestone.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            milestone.completed ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {milestone.title}
                          </span>
                          <span className="text-xs text-gray-500">{milestone.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex space-x-3">
                  <button className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>{roadmap.progress > 0 ? 'Continue' : 'Start Journey'}</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRoadmaps.length === 0 && (
          <div className="text-center py-12">
            <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No roadmaps found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more roadmaps.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmaps;