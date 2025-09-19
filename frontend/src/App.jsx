import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CareerRoadmaps from './pages/CareerRoadmaps';
import AICounseling from './pages/AICounseling';
import ProgressTracker from './pages/ProgressTracker';
import Scholarships from './pages/Scholarships';
import Assessment from './pages/Assessment';
import Community from './pages/Community';
import CollegeFinder from './pages/CollegeFinder';
import CareerRecommendations from './pages/CareerRecommendations';
import JobAgent from './pages/JobAgent';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './context/AuthContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary-600 font-semibold">Loading CareerPath...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/career-roadmaps" element={
            <ProtectedRoute>
              <CareerRoadmaps />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/ai-counseling" element={
            <ProtectedRoute>
              <AICounseling />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/progress-tracker" element={
            <ProtectedRoute>
              <ProgressTracker />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/scholarships" element={
            <ProtectedRoute>
              <Scholarships />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/assessment" element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/college-finder" element={
            <ProtectedRoute>
              <CollegeFinder />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/career-recommendations" element={
            <ProtectedRoute>
              <CareerRecommendations />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/job-agent" element={
            <ProtectedRoute>
              <JobAgent />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;