# AI-Powered Career Roadmap System

This system generates personalized career roadmaps using Google's Generative AI (Gemini) based on user onboarding data and preferences.

## 🌟 Features

### Core Functionality
- **AI-Powered Generation**: Uses Google's Gemini AI to create comprehensive, personalized career roadmaps
- **Smart Caching**: Intelligent caching system to optimize API usage and improve performance
- **Progress Tracking**: Milestone completion tracking with detailed analytics
- **Multiple Career Paths**: Primary path with alternative career suggestions
- **Adaptive Learning**: Recommendations based on learning style and time commitment

### Enhanced User Profiling
- **Comprehensive Onboarding**: Extended assessment covering interests, goals, challenges, and motivations
- **Skills Assessment**: Current skill levels with certification tracking
- **Experience Tracking**: Work history, projects, and achievements
- **Career Preferences**: Work environment, company size, and salary expectations

### Advanced Features
- **Roadmap Versioning**: Track changes and improvements over time
- **Analytics Dashboard**: Detailed progress insights and recommendations
- **Cache Optimization**: Memory and database caching for optimal performance
- **Feedback System**: User rating and feedback collection

## 📋 System Requirements

### Environment Variables
```bash
# Required
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
MONGODB_URI=mongodb://localhost:27017/careerpath

# Optional
CACHE_TIMEOUT=86400000
MAX_CACHE_SIZE=1000
```

### Dependencies
- `@google/generative-ai` - Google's Generative AI SDK
- `mongoose` - MongoDB object modeling
- `express` - Web framework
- `express-validator` - Input validation

## 🚀 Getting Started

### 1. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Add your Google AI API key
# Get it from: https://makersuite.google.com/app/apikey
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Test the System
```bash
# Run comprehensive tests
npm run test:roadmap
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Roadmap Generation
```http
POST /api/roadmap/generate
Authorization: Bearer <token>

# Generates a new personalized career roadmap
```

### Get Active Roadmap
```http
GET /api/roadmap
Authorization: Bearer <token>

# Returns user's current active roadmap
```

### Update Milestone Progress
```http
PUT /api/roadmap/:id/milestone/:phaseId/:milestoneId
Authorization: Bearer <token>
Content-Type: application/json

{
  "completed": true,
  "notes": "Completed JavaScript fundamentals course"
}
```

### Regenerate Roadmap
```http
POST /api/roadmap/regenerate
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Updated skills and preferences"
}
```

### Get Analytics
```http
GET /api/roadmap/analytics/progress
Authorization: Bearer <token>

# Returns detailed progress analytics
```

### Get Suggestions
```http
GET /api/roadmap/suggestions/next-steps
Authorization: Bearer <token>

# Returns AI-powered next step suggestions
```

## 🏗️ System Architecture

### Data Models

#### CareerRoadmap
- **Metadata**: Title, description, version, status
- **User Profile**: Snapshot of user data used for generation
- **Career Paths**: Primary and alternative career recommendations
- **Phases**: Structured learning phases with milestones
- **Progress Tracking**: Completion statistics and analytics
- **AI Generation**: Model info, prompts, and generation metadata

#### Enhanced User Profile
- **Basic Info**: Name, email, onboarding status
- **Onboarding Data**: Interests, goals, learning style, challenges
- **Skills**: Current skills with proficiency levels
- **Experience**: Work history, projects, education
- **Preferences**: Career preferences and constraints

### Services

#### RoadmapGenerationService
- AI prompt engineering and response parsing
- Roadmap creation and management
- Progress tracking and analytics
- Milestone completion handling

#### RoadmapCacheService
- Memory and database caching
- Similarity-based cache retrieval
- Cache invalidation and cleanup
- Performance optimization

## 🎯 Roadmap Structure

### Phases
Each roadmap consists of 3-4 phases:
1. **Foundation Phase** (3-6 months): Basic skills and knowledge
2. **Specialization Phase** (6-12 months): Deep dive into chosen area
3. **Application Phase** (6-12 months): Projects, experience, portfolio
4. **Professional Development** (Ongoing): Advanced skills, leadership

### Milestones
Each phase contains 3-5 milestones with:
- **Learning objectives** and success criteria
- **Estimated duration** and priority level
- **Prerequisites** and dependencies
- **Resources** with ratings and costs
- **Skills** developed and proficiency levels

### Resources
Each milestone includes curated resources:
- **Courses**: Online learning platforms
- **Books**: Technical and professional reading
- **Tools**: Software and development environments
- **Certifications**: Industry-recognized credentials
- **Projects**: Hands-on practice opportunities

## 🔧 Customization

### Learning Style Adaptation
- **Visual**: Infographics, video courses, visual tools
- **Hands-on**: Projects, labs, practical exercises
- **Reading**: Books, documentation, written tutorials
- **Interactive**: Bootcamps, workshops, mentorship

### Goal Alignment
- **High Salary**: High-demand skills, negotiation training
- **Work-Life Balance**: Remote-friendly careers, flexible industries
- **Job Security**: Evergreen skills, recession-proof industries
- **Creativity**: Design, content creation, innovation roles
- **Impact**: Social good, sustainability, meaningful work
- **Flexibility**: Freelancing, consulting, entrepreneurship

### Time Commitment Optimization
- **1-2 hours/week**: Micro-learning, daily practice
- **3-5 hours/week**: Structured courses, part-time programs
- **6-10 hours/week**: Intensive bootcamps, accelerated programs
- **10+ hours/week**: Full-time education, immersive experiences

## 📊 Analytics and Insights

### Progress Metrics
- **Completion Rate**: Overall and per-phase progress
- **Learning Velocity**: Milestones completed over time
- **Skill Development**: Competency growth tracking
- **Goal Achievement**: Progress toward career objectives

### Recommendations Engine
- **Next Steps**: AI-powered suggestions for immediate actions
- **Resource Optimization**: Best learning resources for user's style
- **Career Adjustments**: Path modifications based on progress
- **Networking Opportunities**: Industry connections and events

## 🔄 Caching Strategy

### Memory Cache
- **Fast Access**: Sub-millisecond retrieval for popular roadmaps
- **LRU Eviction**: Automatic cleanup of least-used items
- **Size Limits**: Configurable maximum cache size

### Database Cache
- **Similarity Matching**: Find roadmaps for similar user profiles
- **Access Tracking**: Monitor usage patterns for optimization
- **Expiration**: Automatic cleanup of outdated roadmaps

### Cache Performance
- **Hit Rate Optimization**: Intelligent similarity scoring
- **Cost Reduction**: Minimize AI API calls through effective caching
- **Response Time**: Average response improvement of 80-95%

## 🔍 Testing

### Comprehensive Test Suite
The system includes extensive testing covering:
- **Roadmap Generation**: End-to-end AI generation testing
- **Cache Effectiveness**: Performance and accuracy validation
- **Progress Tracking**: Milestone completion and analytics
- **Data Validation**: Input validation and error handling

### Running Tests
```bash
# Run all roadmap tests
npm run test:roadmap

# Test with mock data (no API key required)
GOOGLE_AI_API_KEY=mock npm run test:roadmap
```

## 🛠️ Troubleshooting

### Common Issues

#### API Key Configuration
```bash
# Verify API key is set
echo $GOOGLE_AI_API_KEY

# Test API connectivity
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$GOOGLE_AI_API_KEY"
```

#### Database Connection
```bash
# Check MongoDB connection
mongo mongodb://localhost:27017/careerpath

# Verify collections
db.careeroadmaps.count()
db.users.count()
```

#### Cache Performance
```bash
# Check cache statistics
curl -H "Authorization: Bearer <token>" \
     http://localhost:5000/api/roadmap/cache/stats
```

## 📈 Performance Metrics

### Expected Performance
- **Initial Generation**: 3-8 seconds (with AI)
- **Cached Retrieval**: 100-300ms
- **Cache Hit Rate**: 60-80% for similar profiles
- **Memory Usage**: ~50MB for 1000 cached roadmaps

### Optimization Tips
1. **Preload Popular Roadmaps**: Cache common profiles during low-traffic periods
2. **Profile Similarity**: Fine-tune similarity scoring for better cache hits
3. **Memory Management**: Adjust cache size based on server capacity
4. **API Rate Limits**: Implement queuing for high-volume generation

## 🔮 Future Enhancements

### Planned Features
- **Real-time Updates**: Live roadmap adjustments based on industry changes
- **Social Features**: Share roadmaps and progress with peers
- **Mentorship Matching**: Connect users with industry professionals
- **Job Market Integration**: Real-time job availability and requirements
- **Skills Assessment**: Automated testing and certification tracking

### AI Improvements
- **Multi-modal Learning**: Video and interactive content integration
- **Adaptive Difficulty**: Dynamic milestone adjustment based on progress
- **Industry Insights**: Real-time market trend integration
- **Personalized Coaching**: AI-powered career guidance and support

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Testing**: Use the comprehensive test suite for validation
- **Debugging**: Enable detailed logging in development mode
- **API Reference**: Use the interactive API documentation

### Contributing
1. **Code Quality**: Follow existing patterns and conventions
2. **Testing**: Add tests for new features and bug fixes
3. **Documentation**: Update README and API docs for changes
4. **Performance**: Consider caching and optimization implications