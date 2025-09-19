import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  Star,
  CheckCircle2,
  Clock,
  Book,
  Zap,
  Medal,
  Crown,
  Flame
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const ProgressTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    currentLevel: 1,
    nextLevelPoints: 100,
    streak: 0,
    completedCourses: 0,
    skillsBadges: 0,
    studyHours: 0
  });
  const [badges, setBadges] = useState([]);
  const [progressData, setProgressData] = useState({
    week: { labels: [], data: [] },
    month: { labels: [], data: [] },
    year: { labels: [], data: [] }
  });
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, badgesRes, progressRes, activityRes, skillsRes] = await Promise.all([
          api.get('/user/stats'),
          api.get('/user/badges'),
          api.get('/user/progress'),
          api.get('/user/activity'),
          api.get('/user/skills')
        ]);

        setUserStats({
          totalPoints: statsRes.data.totalPoints || 0,
          currentLevel: statsRes.data.currentLevel || 1,
          nextLevelPoints: statsRes.data.nextLevelPoints || 100,
          streak: statsRes.data.currentStreak || 0,
          completedCourses: statsRes.data.completedCourses || 0,
          skillsBadges: statsRes.data.totalBadges || 0,
          studyHours: statsRes.data.studyHours || 0
        });
        setBadges((badgesRes.data.badges || []).map((badge, idx) => ({
          ...badge,
          id: idx + 1,
          icon: badge.icon === 'Crown' ? Crown : badge.icon === 'Flame' ? Flame : badge.icon === 'Medal' ? Medal : badge.icon === 'Trophy' ? Trophy : badge.icon === 'Zap' ? Zap : Star,
          earned: true,
          rarity: badge.rarity || 'common',
          points: badge.points || 0,
          earnedDate: badge.earnedAt
        })));
        setProgressData(progressRes.data);
        setRecentAchievements((activityRes.data || []).map((act, idx) => ({
          id: idx + 1,
          type: act.type,
          title: act.title,
          time: act.time,
          points: act.points
        })));
        setSkills((skillsRes.data.skills || []).map(skill => ({
          name: skill.name,
          level: typeof skill.level === 'number' ? skill.level : skill.level === 'expert' ? 100 : skill.level === 'advanced' ? 80 : skill.level === 'intermediate' ? 60 : skill.level === 'beginner' ? 40 : 0,
          category: skill.category || 'General'
        })));
      } catch (err) {
        // handle error (optional)
      }
      setLoading(false);
    };
    fetchData();
  }, []);


  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getSkillColor = (level) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-yellow-500';
    if (level >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
              <p className="text-gray-600">Track your learning journey with gamified progress</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalPoints.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Level {userStats.currentLevel}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress to Level {userStats.currentLevel + 1}</span>
                <span>{Math.round((userStats.totalPoints / userStats.nextLevelPoints) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(userStats.totalPoints / userStats.nextLevelPoints) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Learning Streak</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.streak} days</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed Courses</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.completedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Study Hours</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.studyHours}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Learning Activity</h3>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="flex items-end space-x-2 h-48">
                {progressData[selectedPeriod].data.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col justify-end h-40">
                      <div 
                        className="bg-gradient-to-t from-primary-500 to-accent-500 rounded-t-lg transition-all duration-500"
                        style={{ height: `${(value / Math.max(...progressData[selectedPeriod].data)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">
                      {progressData[selectedPeriod].labels[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Development</h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({skill.category})</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getSkillColor(skill.level)}`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{achievement.time}</span>
                        <span className="text-xs font-medium text-primary-600">+{achievement.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges Collection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges Collection</h3>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => {
                  const IconComponent = badge.icon;
                  return (
                    <div 
                      key={badge.id} 
                      className={`p-3 rounded-lg border-2 ${
                        badge.earned ? getRarityColor(badge.rarity) : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <IconComponent className="w-6 h-6 mb-2" />
                        <h4 className="text-xs font-semibold">{badge.name}</h4>
                        <p className="text-xs opacity-75 mt-1">{badge.description}</p>
                        {badge.earned ? (
                          <div className="mt-2">
                            <span className="text-xs font-medium">+{badge.points} pts</span>
                          </div>
                        ) : (
                          badge.progress !== undefined && (
                            <div className="mt-2 w-full">
                              <div className="flex justify-between text-xs mb-1">
                                <span>{badge.progress}/{badge.total}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                  className="bg-primary-500 h-1 rounded-full"
                                  style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Milestone */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Milestone</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Level 9 Master</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {userStats.nextLevelPoints - userStats.totalPoints} points to go
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(userStats.totalPoints / userStats.nextLevelPoints) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round((userStats.totalPoints / userStats.nextLevelPoints) * 100)}% complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;