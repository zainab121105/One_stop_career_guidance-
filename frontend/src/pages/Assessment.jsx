import React, { useState } from 'react';
import { 
  Target, 
  Play, 
  Clock, 
  CheckCircle2,
  BarChart3,
  PieChart,
  TrendingUp,
  Award,
  RefreshCw,
  Download
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const Assessment = () => {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);

  const assessmentTypes = [
    {
      id: 'personality',
      title: 'Personality Assessment',
      description: 'Discover your personality traits and how they align with different career paths.',
      duration: '15-20 minutes',
      questions: 50,
      type: 'Multiple Choice',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      completed: true,
      lastTaken: '2024-01-15',
      score: 85
    },
    {
      id: 'aptitude',
      title: 'Aptitude Test',
      description: 'Evaluate your logical reasoning, numerical ability, and problem-solving skills.',
      duration: '30-45 minutes',
      questions: 75,
      type: 'Mixed Format',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-500',
      completed: false,
      lastTaken: null,
      score: null
    },
    {
      id: 'interests',
      title: 'Career Interest Inventory',
      description: 'Identify your professional interests and preferred work environments.',
      duration: '10-15 minutes',
      questions: 40,
      type: 'Rating Scale',
      icon: PieChart,
      color: 'from-green-500 to-teal-500',
      completed: true,
      lastTaken: '2024-01-10',
      score: 78
    },
    {
      id: 'skills',
      title: 'Skills Assessment',
      description: 'Assess your current skill levels and identify areas for improvement.',
      duration: '20-25 minutes',
      questions: 60,
      type: 'Self-Assessment',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      completed: false,
      lastTaken: null,
      score: null
    }
  ];

  const recentResults = [
    {
      id: 1,
      type: 'Personality Assessment',
      date: '2024-01-15',
      score: 85,
      result: 'Analytical Thinker',
      recommendations: ['Data Science', 'Software Engineering', 'Research']
    },
    {
      id: 2,
      type: 'Career Interest Inventory', 
      date: '2024-01-10',
      score: 78,
      result: 'Technology Oriented',
      recommendations: ['Web Development', 'Cybersecurity', 'AI/ML']
    }
  ];

  const startAssessment = (assessmentId) => {
    setCurrentAssessment(assessmentId);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Multi-dimensional Assessment Engine</h1>
              <p className="text-gray-600">Comprehensive career assessments to guide your path</p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessmentTypes.filter(a => a.completed).length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">82%</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Time Invested</p>
                <p className="text-2xl font-bold text-gray-900">45m</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Recommendations</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment Types */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Available Assessments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assessmentTypes.map((assessment) => {
                  const IconComponent = assessment.icon;
                  return (
                    <div key={assessment.id} className="border border-gray-200 rounded-xl p-6 hover:border-primary-300 transition-colors">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${assessment.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{assessment.title}</h3>
                          {assessment.completed && (
                            <div className="flex items-center space-x-2 mt-1">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getScoreColor(assessment.score)}`}>
                                {assessment.score}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span className="text-gray-700">{assessment.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Questions:</span>
                          <span className="text-gray-700">{assessment.questions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Type:</span>
                          <span className="text-gray-700">{assessment.type}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => startAssessment(assessment.id)}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                            assessment.completed
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-primary-500 text-white hover:bg-primary-600'
                          }`}
                        >
                          {assessment.completed ? (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              <span>Retake</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              <span>Start</span>
                            </>
                          )}
                        </button>
                        {assessment.completed && (
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Results */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h3>
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div key={result.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{result.type}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{result.result}</p>
                    <p className="text-xs text-gray-500 mb-3">{result.date}</p>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Top matches:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.recommendations.slice(0, 2).map((rec, index) => (
                          <span key={index} className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Tips */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2"></div>
                  <p>Answer honestly for accurate results</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2"></div>
                  <p>Take assessments in a quiet environment</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2"></div>
                  <p>Don't overthink your responses</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2"></div>
                  <p>Retake assessments every 6 months</p>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
              <div className="space-y-3">
                {assessmentTypes.map((assessment) => (
                  <div key={assessment.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{assessment.title}</span>
                      <span className="text-gray-500">
                        {assessment.completed ? `${assessment.score}%` : 'Not taken'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${assessment.color} transition-all duration-300`}
                        style={{ width: assessment.completed ? `${assessment.score}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;