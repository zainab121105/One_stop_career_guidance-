import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Users, Shield, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const { user, signInWithGoogle, loading } = useAuth();

  // Local signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupMessage, setSignupMessage] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupMessage('');
    setSignupError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, password: signupPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setSignupMessage('Registration successful! You can now log in.');
        setSignupEmail('');
        setSignupPassword('');
      } else {
        setSignupError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setSignupError('Network error.');
    } finally {
      setSignupLoading(false);
    }
  };

  if (user) {
    return <Navigate to={user.onboardingCompleted ? "/dashboard" : "/onboarding"} replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800"></div>
        <div className="relative z-10 text-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BookOpen className="h-20 w-20 mx-auto mb-8" />
            <h1 className="text-4xl font-bold mb-6">
              Welcome to CareerCompass
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-md">
              India's most trusted AI-powered career guidance platform for students
            </p>
            
            <div className="space-y-4 text-left">
              {[
                { icon: Users, text: "50,000+ successful career transformations" },
                { icon: Star, text: "4.9/5 rating from students across India" },
                { icon: Shield, text: "Secure and private - your data is protected" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <item.icon className="h-5 w-5 text-primary-200" />
                  <span className="text-primary-100">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-white opacity-10 rounded-full"></div>
      </div>

      {/* Right Side - Authentication */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="lg:hidden mb-6">
              <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Get Started Today
            </h2>
            <p className="text-gray-600">
              Sign in to unlock your personalized career journey
            </p>
          </div>


          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-medium hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Email/password signup form */}
            <form className="mt-8" onSubmit={handleSignup}>
              <div className="mb-4">
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Password"
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all disabled:opacity-50"
                disabled={signupLoading}
              >
                {signupLoading ? 'Signing up...' : 'Sign up with Email'}
              </button>
              {signupMessage && <div className="mt-3 text-green-600 text-center text-sm">{signupMessage}</div>}
              {signupError && <div className="mt-3 text-red-600 text-center text-sm">{signupError}</div>}

            </form>
            <div className="mt-4 text-center">
              <span className="text-gray-600 text-sm">Already have an account? </span>
              <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</a>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl p-4">
              <p className="text-sm text-gray-700 font-medium">
                🎉 Limited Time: Get premium career insights FREE for your first month!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;