import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, User, GraduationCap, Brain, Target, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingStep } from '../types';

const Onboarding: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    interests: [] as string[],
    academic: {
      level: '',
      stream: '',
      subjects: [] as string[],
      marks: '',
      institution: ''
    },
    skills: [] as string[],
    goals: [] as string[]
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  const steps: OnboardingStep[] = [
    { id: 0, title: "Welcome", description: "Let's get to know you", completed: false },
    { id: 1, title: "Interests", description: "What excites you?", completed: false },
    { id: 2, title: "Academic Profile", description: "Your educational background", completed: false },
    { id: 3, title: "Skills Assessment", description: "Quick aptitude test", completed: false },
    { id: 4, title: "Career Goals", description: "Where do you see yourself?", completed: false }
  ];

  const interestOptions = [
    "Technology & Programming", "Business & Finance", "Creative Arts & Design",
    "Science & Research", "Healthcare & Medicine", "Education & Training",
    "Sports & Fitness", "Social Work & NGO", "Media & Journalism",
    "Engineering & Manufacturing", "Law & Legal Services", "Agriculture & Environment"
  ];

  const skillOptions = [
    "Problem Solving", "Communication", "Leadership", "Analytical Thinking",
    "Creativity", "Time Management", "Teamwork", "Programming",
    "Data Analysis", "Public Speaking", "Writing", "Project Management"
  ];

  const goalOptions = [
    "Start my own business", "Work in a top tech company", "Pursue higher studies abroad",
    "Government job/Civil services", "Research & Innovation", "Creative freelancing",
    "Corporate leadership role", "Social impact career", "Teaching & Academia",
    "Consulting & Advisory", "Healthcare professional", "Financial services"
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <Sparkles className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to CareerCompass, {user.name}!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're excited to help you discover your perfect career path. This personalized 
              assessment will take about 5 minutes and will help us provide you with the most 
              accurate career recommendations.
            </p>
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">What you'll get:</h3>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Personalized career recommendations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Skills gap analysis and learning paths</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Industry insights and salary data</span>
                </li>
              </ul>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="interests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <Target className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What interests you most?</h2>
              <p className="text-gray-600">Select all areas that genuinely excite you (choose 3-6)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {interestOptions.map((interest, index) => (
                <button
                  key={index}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    formData.interests.includes(interest)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
                  }`}
                >
                  <span className="font-medium">{interest}</span>
                </button>
              ))}
            </div>

            {formData.interests.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Selected {formData.interests.length} interest{formData.interests.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="academic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <GraduationCap className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Academic Background</h2>
              <p className="text-gray-600">Tell us about your educational journey</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Education Level
                </label>
                <select
                  value={formData.academic.level}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    academic: { ...prev.academic, level: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select level</option>
                  <option value="high-school">High School (10th/12th)</option>
                  <option value="intermediate">Intermediate/Diploma</option>
                  <option value="undergraduate">Undergraduate (Bachelor's)</option>
                  <option value="postgraduate">Postgraduate (Master's/PhD)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream/Field
                  </label>
                  <input
                    type="text"
                    value={formData.academic.stream}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      academic: { ...prev.academic, stream: e.target.value }
                    }))}
                    placeholder="e.g., Science, Commerce, Arts, Engineering"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={formData.academic.institution}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      academic: { ...prev.academic, institution: e.target.value }
                    }))}
                    placeholder="School/College name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Performance (Optional)
                </label>
                <input
                  type="text"
                  value={formData.academic.marks}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    academic: { ...prev.academic, marks: e.target.value }
                  }))}
                  placeholder="e.g., 85%, 8.5 CGPA"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <Brain className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills & Strengths</h2>
              <p className="text-gray-600">What are you naturally good at? (Select 4-8 skills)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {skillOptions.map((skill, index) => (
                <button
                  key={index}
                  onClick={() => handleSkillToggle(skill)}
                  className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                    formData.skills.includes(skill)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
                  }`}
                >
                  <span className="text-sm font-medium">{skill}</span>
                </button>
              ))}
            </div>

            {formData.skills.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Selected {formData.skills.length} skill{formData.skills.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <Target className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Career Aspirations</h2>
              <p className="text-gray-600">What are your professional goals? (Select 2-4 options)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goalOptions.map((goal, index) => (
                <button
                  key={index}
                  onClick={() => handleGoalToggle(goal)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    formData.goals.includes(goal)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
                  }`}
                >
                  <span className="font-medium">{goal}</span>
                </button>
              ))}
            </div>

            {formData.goals.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Selected {formData.goals.length} goal{formData.goals.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return formData.interests.length >= 3;
      case 2:
        return formData.academic.level && formData.academic.stream;
      case 3:
        return formData.skills.length >= 4;
      case 4:
        return formData.goals.length >= 2;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  index <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <button
            onClick={currentStep === steps.length - 1 ? () => {
              // Complete onboarding
              console.log('Onboarding completed', formData);
            } : handleNext}
            disabled={!canProceed()}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;