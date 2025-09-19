import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Target, 
  Users, 
  Trophy, 
  Brain, 
  MapPin, 
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Career Roadmaps",
      description: "Get custom-tailored career paths based on your interests, skills, and goals."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Career Counselling",
      description: "24/7 AI-powered career guidance to help you make informed decisions."
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Gamified Progress Tracker",
      description: "Track your learning journey with badges, achievements, and skill growth."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Scholarships & Schemes",
      description: "Discover government scholarships and educational funding opportunities."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Support",
      description: "Connect with mentors, teachers, and peers for career guidance."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "College & Course Finder",
      description: "Find and compare government colleges and courses near you."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "CareerPath helped me discover my passion for data science and provided a clear roadmap to achieve my goals.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Raj Patel",
      role: "High School Graduate",
      content: "The AI counselling feature guided me through choosing the right engineering stream. It's like having a personal mentor 24/7.",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Emily Chen",
      role: "Career Changer",
      content: "Thanks to CareerPath, I successfully transitioned from marketing to UX design with their personalized learning path.",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Career Guidance</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
              Your Journey to the
              <span className="gradient-text block mt-2">Perfect Career</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
              Discover personalized career paths, get AI-powered guidance, and unlock your full potential 
              with our comprehensive career and education advisory platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Link 
                to="/signup"
                className="bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                to="/login"
                className="border-2 border-primary-500 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                I Already Have Account
              </Link>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200 rounded-full opacity-20 animate-bounce-subtle"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-200 rounded-full opacity-20 animate-bounce-subtle" style={{animationDelay: '1s'}}></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Career Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and guidance you need to build a successful career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-2 group"
              >
                <div className="bg-primary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How CareerPath Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Take Assessment</h3>
              <p className="text-gray-600">
                Complete our intelligent onboarding process to understand your interests, skills, and career aspirations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Personalized Plan</h3>
              <p className="text-gray-600">
                Receive a custom career roadmap with learning resources, skill development paths, and milestone tracking.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-warning-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Achieve Your Goals</h3>
              <p className="text-gray-600">
                Follow your personalized path, track progress, earn achievements, and get continuous AI-powered guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students and professionals who have transformed their careers with CareerPath
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students and professionals who have already started their journey to career success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-primary-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CP</span>
                </div>
                <span className="text-xl font-bold">CareerPath</span>
              </div>
              <p className="text-gray-400">
                Empowering students and professionals to discover and achieve their ideal careers through AI-powered guidance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Career Roadmaps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Counselling</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Progress Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CareerPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;