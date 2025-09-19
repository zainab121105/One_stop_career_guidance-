import { useState, useEffect } from 'react';
import { 
  User, 
  Target, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Award,
  Clock,
  CheckCircle2,
  Map,
  Bot,
  GraduationCap,
  Users,
  School,
  Lightbulb,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../services/api';

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    completedCourses: 0,
    totalBadges: 0,
    studyHours: 0,
    currentStreak: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [careerRecommendations, setCareerRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes, recommendationsRes] = await Promise.all([
        api.get('/user/stats'),
        api.get('/user/activity'),
        api.get('/user/recommendations')
      ]);

      setUserStats(statsRes.data);
      setRecentActivity(activityRes.data);
      setCareerRecommendations(recommendationsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                <p className="text-primary-100">Continue your journey to career success</p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access to Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Career Roadmaps', path: '/dashboard/career-roadmaps', icon: Map, color: 'from-blue-500 to-cyan-500' },
              { name: 'AI Counseling', path: '/dashboard/ai-counseling', icon: Bot, color: 'from-purple-500 to-pink-500' },
              { name: 'Progress Tracker', path: '/dashboard/progress-tracker', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
              { name: 'Scholarships', path: '/dashboard/scholarships', icon: GraduationCap, color: 'from-green-500 to-teal-500' },
              { name: 'Assessment', path: '/dashboard/assessment', icon: Target, color: 'from-indigo-500 to-purple-500' },
              { name: 'Community', path: '/dashboard/community', icon: Users, color: 'from-blue-500 to-indigo-500' },
              { name: 'College Finder', path: '/dashboard/college-finder', icon: School, color: 'from-green-500 to-blue-500' },
              { name: 'Recommendations', path: '/dashboard/career-recommendations', icon: Lightbulb, color: 'from-purple-500 to-indigo-500' },
              { name: 'Job Agent', path: '/dashboard/job-agent', icon: Briefcase, color: 'from-green-500 to-blue-500' }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <a
                  key={index}
                  href={feature.path}
                  className="group block p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {feature.name}
                    </h4>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Courses Completed</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.completedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Badges Earned</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalBadges}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Study Hours</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.studyHours}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.currentStreak} days</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Career Recommendations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recommended Career Paths</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                  <span>View all</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {careerRecommendations.length > 0 ? (
                  careerRecommendations.map((career, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{career.title}</h4>
                          <p className="text-gray-600 text-sm">{career.description}</p>
                          <div className="flex items-center mt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{career.matchPercentage}% match</span>
                            </div>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{career.averageSalary}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Getting Your Recommendations Ready</h4>
                    <p className="text-gray-600">We're analyzing your profile to provide personalized career suggestions.</p>
                    <button className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                      Complete Assessment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                  <Target className="w-5 h-5" />
                  <span>Take Career Assessment</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <BookOpen className="w-5 h-5" />
                  <span>Browse Courses</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Mentoring</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm">No recent activity</p>
                    <p className="text-gray-500 text-xs">Start learning to see your progress here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Welcome Badge</p>
                    <p className="text-xs text-gray-600">Completed profile setup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;