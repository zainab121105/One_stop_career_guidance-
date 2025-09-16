import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Target, BookOpen, Award, Users, Star, ArrowRight, BarChart3, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  const careerSuggestions = [
    {
      title: "Software Development Engineer",
      matchPercentage: 92,
      description: "Build innovative software solutions using cutting-edge technologies",
      averageSalary: "₹8-25 LPA",
      growthPotential: "High",
      skills: ["Programming", "Problem Solving", "Analytical Thinking"]
    },
    {
      title: "Data Scientist",
      matchPercentage: 87,
      description: "Extract insights from data to drive business decisions",
      averageSalary: "₹10-30 LPA",
      growthPotential: "High",
      skills: ["Data Analysis", "Programming", "Statistics"]
    },
    {
      title: "Product Manager",
      matchPercentage: 78,
      description: "Lead product development and strategy in tech companies",
      averageSalary: "₹15-40 LPA",
      growthPotential: "High",
      skills: ["Leadership", "Communication", "Strategic Thinking"]
    }
  ];

  const skillsProgress = [
    { name: "Programming", level: 75, target: 90 },
    { name: "Data Analysis", level: 60, target: 85 },
    { name: "Communication", level: 85, target: 95 },
    { name: "Problem Solving", level: 80, target: 90 }
  ];

  const milestones = [
    { title: "Complete React Certification", deadline: "2024-02-15", status: "in-progress" },
    { title: "Build Portfolio Website", deadline: "2024-02-28", status: "pending" },
    { title: "Apply to Internships", deadline: "2024-03-15", status: "pending" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-600">
              Your personalized career journey continues. Here's what's happening.
            </p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Target, label: "Career Match", value: "92%", color: "text-primary-600" },
            { icon: TrendingUp, label: "Skills Growth", value: "+15%", color: "text-success-600" },
            { icon: BookOpen, label: "Courses Completed", value: "3", color: "text-secondary-600" },
            { icon: Award, label: "Certificates Earned", value: "2", color: "text-purple-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Career Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Top Career Matches</h2>
                <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {careerSuggestions.map((career, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{career.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{career.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary-600">
                          {career.matchPercentage}%
                        </div>
                        <div className="text-xs text-gray-500">Match</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>💰 {career.averageSalary}</span>
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {career.growthPotential} Growth
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Skills Development</h2>
              
              <div className="space-y-4">
                {skillsProgress.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className="text-sm text-gray-600">{skill.level}% / {skill.target}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full relative"
                        style={{ width: `${skill.level}%` }}
                      >
                        <div 
                          className="absolute right-0 top-0 h-2 w-1 bg-secondary-600 rounded-full"
                          style={{ transform: `translateX(${(skill.target - skill.level) * 100 / skill.target}%)` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: Brain, text: "Take Skill Assessment", color: "text-primary-600" },
                  { icon: BarChart3, text: "View Career Genome", color: "text-secondary-600" },
                  { icon: BookOpen, text: "Browse Courses", color: "text-success-600" },
                  { icon: Users, text: "Connect with Mentors", color: "text-purple-600" }
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group"
                  >
                    <action.icon className={`h-5 w-5 ${action.color} mr-3`} />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {action.text}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Upcoming Milestones</h3>
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      milestone.status === 'in-progress' ? 'bg-secondary-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                      <p className="text-xs text-gray-500">Due: {milestone.deadline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl shadow-lg p-6 text-white"
            >
              <div className="text-center">
                <Star className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-bold mb-2">Rising Star!</h3>
                <p className="text-sm text-white/90">
                  You've completed 3 skill assessments this month. Keep up the excellent work!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;