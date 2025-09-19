import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home,
  Map,
  Bot,
  Trophy,
  GraduationCap,
  Target,
  Users,
  School,
  Lightbulb,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const features = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home
    },
    {
      name: 'Career Roadmaps',
      path: '/dashboard/career-roadmaps',
      icon: Map
    },
    {
      name: 'AI Counseling',
      path: '/dashboard/ai-counseling',
      icon: Bot
    },
    {
      name: 'Progress Tracker',
      path: '/dashboard/progress-tracker',
      icon: Trophy
    },
    {
      name: 'Scholarships',
      path: '/dashboard/scholarships',
      icon: GraduationCap
    },
    {
      name: 'Assessment',
      path: '/dashboard/assessment',
      icon: Target
    },
    {
      name: 'Community',
      path: '/dashboard/community',
      icon: Users
    },
    {
      name: 'College Finder',
      path: '/dashboard/college-finder',
      icon: School
    },
    {
      name: 'Career Recommendations',
      path: '/dashboard/career-recommendations',
      icon: Lightbulb
    },
    {
      name: 'Job Agent',
      path: '/dashboard/job-agent',
      icon: Briefcase
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsFeatureDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 navbar-container">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 gap-2">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 flex-shrink-0 min-w-0">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-base font-bold text-gray-900 truncate">CareerPath</h1>
                <p className="text-xs text-gray-500 truncate">Career Guidance</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Horizontal Scrollable with better overflow handling */}
          <div className="hidden lg:flex flex-1 mx-2 min-w-0">
            <div className="flex space-x-1 overflow-x-auto nav-scroll pb-1 w-full">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Link
                    key={feature.path}
                    to={feature.path}
                    className={`flex items-center space-x-1 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                      isActive(feature.path)
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">{feature.name}</span>
                    <span className="xl:hidden">{feature.name.split(' ')[0]}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Medium screens navigation - Dropdown */}
          <div className="hidden md:flex lg:hidden flex-1 mx-2">
            <div className="relative w-full max-w-48">
              <button
                onClick={() => setIsFeatureDropdownOpen(!isFeatureDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="truncate">Features</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              {isFeatureDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-96 overflow-y-auto z-50">
                  {features.map((feature) => {
                    const IconComponent = feature.icon;
                    return (
                      <Link
                        key={feature.path}
                        to={feature.path}
                        onClick={() => setIsFeatureDropdownOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          isActive(feature.path) ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{feature.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-1 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-20 truncate">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="py-4 space-y-2">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Link
                    key={feature.path}
                    to={feature.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(feature.path)
                        ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{feature.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Background overlay for dropdowns */}
      {(isFeatureDropdownOpen || isUserDropdownOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => {
            setIsFeatureDropdownOpen(false);
            setIsUserDropdownOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default DashboardNavbar;