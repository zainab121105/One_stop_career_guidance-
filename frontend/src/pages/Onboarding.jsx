import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  Target,
  BookOpen,
  Code,
  Palette,
  Calculator,
  Users,
  Building,
  Check,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    currentLevel: '',
    careerStage: '',
    interests: [],
    goals: [],
    preferredLearningStyle: '',
    timeCommitment: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const steps = [
    {
      title: "What's your current education level?",
      subtitle: "Help us understand where you are in your journey",
      type: 'single-choice',
      field: 'currentLevel',
      options: [
        { id: 'high-school', label: 'High School Student', icon: <GraduationCap className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
        { id: 'college', label: 'College Student', icon: <BookOpen className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
        { id: 'graduate', label: 'Graduate/Post-Graduate', icon: <Target className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
        { id: 'professional', label: 'Working Professional', icon: <Briefcase className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600' }
      ]
    },
    {
      title: "What's your career stage?",
      subtitle: "This helps us tailor our recommendations",
      type: 'single-choice',
      field: 'careerStage',
      options: [
        { id: 'exploring', label: 'Just exploring options', icon: <Heart className="w-6 h-6" />, color: 'bg-pink-100 text-pink-600' },
        { id: 'deciding', label: 'Deciding on a path', icon: <Target className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
        { id: 'switching', label: 'Changing careers', icon: <ArrowRight className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
        { id: 'advancing', label: 'Advancing current career', icon: <Briefcase className="w-6 h-6" />, color: 'bg-green-100 text-green-600' }
      ]
    },
    {
      title: "What interests you most?",
      subtitle: "Select all that apply - we'll find careers that match!",
      type: 'multiple-choice',
      field: 'interests',
      options: [
        { id: 'technology', label: 'Technology & Programming', icon: <Code className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
        { id: 'creative', label: 'Creative Arts & Design', icon: <Palette className="w-6 h-6" />, color: 'bg-pink-100 text-pink-600' },
        { id: 'business', label: 'Business & Entrepreneurship', icon: <Building className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
        { id: 'science', label: 'Science & Research', icon: <Calculator className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
        { id: 'healthcare', label: 'Healthcare & Medicine', icon: <Heart className="w-6 h-6" />, color: 'bg-red-100 text-red-600' },
        { id: 'education', label: 'Education & Teaching', icon: <GraduationCap className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' },
        { id: 'social', label: 'Social Work & Community', icon: <Users className="w-6 h-6" />, color: 'bg-teal-100 text-teal-600' },
        { id: 'finance', label: 'Finance & Banking', icon: <Calculator className="w-6 h-6" />, color: 'bg-indigo-100 text-indigo-600' }
      ]
    },
    {
      title: "What are your main goals?",
      subtitle: "Choose what matters most to you",
      type: 'multiple-choice',
      field: 'goals',
      options: [
        { id: 'high-salary', label: 'High Salary Potential', icon: <Target className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
        { id: 'work-life-balance', label: 'Good Work-Life Balance', icon: <Heart className="w-6 h-6" />, color: 'bg-pink-100 text-pink-600' },
        { id: 'job-security', label: 'Job Security & Stability', icon: <Briefcase className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
        { id: 'creativity', label: 'Creative Expression', icon: <Palette className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
        { id: 'impact', label: 'Making a Difference', icon: <Users className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600' },
        { id: 'flexibility', label: 'Flexible Work Options', icon: <ArrowRight className="w-6 h-6" />, color: 'bg-teal-100 text-teal-600' }
      ]
    },
    {
      title: "How do you prefer to learn?",
      subtitle: "We'll customize your learning experience",
      type: 'single-choice',
      field: 'preferredLearningStyle',
      options: [
        { id: 'visual', label: 'Visual (charts, diagrams, videos)', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
        { id: 'hands-on', label: 'Hands-on (projects, practice)', icon: <Code className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
        { id: 'reading', label: 'Reading & Research', icon: <GraduationCap className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
        { id: 'interactive', label: 'Interactive & Social', icon: <Users className="w-6 h-6" />, color: 'bg-pink-100 text-pink-600' }
      ]
    },
    {
      title: "How much time can you dedicate?",
      subtitle: "We'll create a realistic plan for you",
      type: 'single-choice',
      field: 'timeCommitment',
      options: [
        { id: '1-2-hours', label: '1-2 hours per week', icon: <Target className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' },
        { id: '3-5-hours', label: '3-5 hours per week', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
        { id: '6-10-hours', label: '6-10 hours per week', icon: <Briefcase className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
        { id: '10-plus-hours', label: '10+ hours per week', icon: <GraduationCap className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' }
      ]
    }
  ];

  const handleOptionSelect = (field, value, isMultiple = false) => {
    if (isMultiple) {
      setOnboardingData(prev => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter(item => item !== value)
          : [...prev[field], value]
      }));
    } else {
      setOnboardingData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await api.post('/user/onboarding', onboardingData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepComplete = () => {
    const currentField = steps[currentStep].field;
    const value = onboardingData[currentField];
    
    if (steps[currentStep].type === 'multiple-choice') {
      return Array.isArray(value) && value.length > 0;
    }
    return Boolean(value);
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">CP</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Welcome, {user?.name}!</h1>
                <p className="text-sm text-gray-600">Let's personalize your career journey</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 text-lg">
                {steps[currentStep].subtitle}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {steps[currentStep].options.map((option) => {
                const isSelected = steps[currentStep].type === 'multiple-choice' 
                  ? onboardingData[steps[currentStep].field].includes(option.id)
                  : onboardingData[steps[currentStep].field] === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(
                      steps[currentStep].field, 
                      option.id, 
                      steps[currentStep].type === 'multiple-choice'
                    )}
                    className={`relative p-6 rounded-xl border-2 text-left transition-all transform hover:scale-105 hover:shadow-lg ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${option.color}`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{option.label}</h3>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!isStepComplete() || isLoading}
                className="flex items-center space-x-2 bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;