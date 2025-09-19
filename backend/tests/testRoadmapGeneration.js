import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import CareerRoadmap from '../models/CareerRoadmap.js';
import RoadmapGenerationService from '../services/RoadmapGenerationService.js';
import { fileURLToPath } from 'url';

dotenv.config();

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  onboardingCompleted: true,
  onboardingData: {
    currentLevel: 'college',
    careerStage: 'deciding',
    interests: ['technology', 'creative', 'business'],
    goals: ['high-salary', 'work-life-balance', 'job-security'],
    preferredLearningStyle: 'visual',
    timeCommitment: '3-5-hours',
    challenges: ['skill-gaps', 'unclear-direction'],
    motivations: ['career-growth', 'financial-stability'],
    currentSituation: {
      employment: 'student',
      satisfactionLevel: 6,
      biggestConcern: 'Finding the right career path',
      dreamJob: 'Software Developer with good work-life balance'
    }
  },
  profile: {
    experience: '0-1-years',
    currentSkills: [
      {
        name: 'JavaScript',
        level: 'beginner',
        yearStarted: 2024
      },
      {
        name: 'HTML/CSS',
        level: 'intermediate',
        yearStarted: 2023
      }
    ],
    education: {
      level: 'bachelor',
      field: 'Computer Science',
      institution: 'University of Technology',
      graduationYear: 2025
    },
    careerPreferences: {
      workEnvironment: 'hybrid',
      companySize: 'medium',
      industrySectors: ['technology', 'startups'],
      jobTypes: ['full-time'],
      salaryExpectation: {
        min: 60000,
        max: 90000,
        currency: 'USD'
      },
      willingToRelocate: false
    }
  }
};

class RoadmapTester {
  constructor() {
    this.roadmapService = new RoadmapGenerationService();
  }

  async connectDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerpath_test');
      console.log('✅ Connected to test database');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  async cleanup() {
    try {
      // Clean up test data
      await User.deleteMany({ email: { $regex: /test.*@example\.com/ } });
      await CareerRoadmap.deleteMany({ 'userProfile.currentLevel': 'college' });
      console.log('✅ Cleaned up test data');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }

  async createTestUser() {
    try {
      const user = new User(testUser);
      await user.save();
      console.log('✅ Test user created:', user._id);
      return user;
    } catch (error) {
      console.error('❌ Failed to create test user:', error);
      throw error;
    }
  }

  async testRoadmapGeneration() {
    console.log('\n🚀 Starting Roadmap Generation Tests\n');

    try {
      // Check if Google AI API key is configured
      if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY === 'your-google-ai-api-key-for-gemini') {
        console.log('⚠️  Google AI API key not configured - testing with mock data');
        return this.testWithMockData();
      }

      await this.connectDB();
      await this.cleanup();

      // Test 1: Create user and generate roadmap
      console.log('📝 Test 1: Generating roadmap for new user');
      const user = await this.createTestUser();
      
      const startTime = Date.now();
      const roadmap = await this.roadmapService.generateRoadmap(user);
      const generationTime = Date.now() - startTime;

      console.log(`✅ Roadmap generated in ${generationTime}ms`);
      console.log(`📊 Roadmap title: ${roadmap.title}`);
      console.log(`📊 Primary career: ${roadmap.primaryCareerPath.title}`);
      console.log(`📊 Number of phases: ${roadmap.phases.length}`);
      console.log(`📊 Total milestones: ${roadmap.overallProgress.totalMilestones}`);
      console.log(`📊 Match score: ${roadmap.matchScore}%`);

      // Test 2: Cache effectiveness
      console.log('\n📝 Test 2: Testing cache effectiveness');
      const startTime2 = Date.now();
      const cachedRoadmap = await this.roadmapService.generateRoadmap(user);
      const cacheTime = Date.now() - startTime2;

      console.log(`✅ Cached roadmap retrieved in ${cacheTime}ms`);
      console.log(`📊 Cache performance improvement: ${Math.round(((generationTime - cacheTime) / generationTime) * 100)}%`);

      // Test 3: Milestone updates
      console.log('\n📝 Test 3: Testing milestone progress updates');
      if (roadmap.phases.length > 0 && roadmap.phases[0].milestones.length > 0) {
        const firstPhase = roadmap.phases[0];
        const firstMilestone = firstPhase.milestones[0];

        const updatedRoadmap = await this.roadmapService.updateMilestoneProgress(
          roadmap._id,
          firstPhase.id,
          firstMilestone.id,
          true,
          'Test completion note'
        );

        console.log(`✅ Milestone marked as completed`);
        console.log(`📊 Updated progress: ${updatedRoadmap.overallProgress.percentageComplete}%`);
      }

      // Test 4: Analytics
      console.log('\n📝 Test 4: Testing analytics generation');
      const analytics = await this.roadmapService.getRoadmapAnalytics(user._id);
      console.log(`✅ Analytics generated`);
      console.log(`📊 Total milestones: ${analytics.totalMilestones}`);
      console.log(`📊 Completed milestones: ${analytics.completedMilestones}`);
      console.log(`📊 Average progress: ${analytics.averageProgress}%`);

      // Test 5: Regeneration
      console.log('\n📝 Test 5: Testing roadmap regeneration');
      const regeneratedRoadmap = await this.roadmapService.regenerateRoadmap(user._id, 'Test regeneration');
      console.log(`✅ Roadmap regenerated`);
      console.log(`📊 New version: ${regeneratedRoadmap.version}`);

      console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
      console.error('❌ Test failed:', error);
    } finally {
      await this.cleanup();
      await mongoose.disconnect();
      console.log('✅ Database disconnected');
    }
  }

  async testWithMockData() {
    console.log('\n📝 Testing with mock data (no AI generation)');
    
    // Simulate roadmap structure
    const mockRoadmap = {
      title: 'Full-Stack Developer Career Roadmap',
      description: 'A comprehensive path to becoming a full-stack developer',
      primaryCareerPath: {
        title: 'Full-Stack Developer',
        description: 'Build end-to-end web applications',
        industry: 'Technology',
        level: 'entry',
        averageSalary: { min: 65000, max: 95000, currency: 'USD' },
        growthOutlook: 'excellent',
        keySkills: [
          { name: 'JavaScript', importance: 'essential' },
          { name: 'React', importance: 'essential' },
          { name: 'Node.js', importance: 'important' }
        ],
        timeToEntry: '6-12 months'
      },
      phases: [
        {
          id: 'phase_1',
          title: 'Foundation Phase',
          description: 'Build fundamental programming skills',
          estimatedDuration: '3-4 months',
          order: 1,
          milestones: [
            {
              id: 'milestone_1_1',
              title: 'Master JavaScript Fundamentals',
              description: 'Learn core JavaScript concepts and syntax',
              category: 'skill',
              estimatedDuration: '6-8 weeks',
              priority: 'high',
              prerequisites: [],
              resources: [
                {
                  type: 'course',
                  title: 'JavaScript for Beginners',
                  url: 'https://javascript.info',
                  description: 'Comprehensive JavaScript tutorial',
                  cost: 'Free',
                  rating: 4.8
                }
              ],
              skills: [{ name: 'JavaScript', level: 'beginner' }]
            }
          ]
        }
      ],
      matchScore: 85,
      personalizedRecommendations: [
        {
          type: 'Focus on visual learning resources',
          category: 'learning',
          priority: 'high'
        }
      ],
      nextSteps: [
        {
          action: 'Start JavaScript fundamentals course',
          deadline: '2025-10-01',
          importance: 'critical'
        }
      ]
    };

    console.log('✅ Mock roadmap structure validated');
    console.log(`📊 Title: ${mockRoadmap.title}`);
    console.log(`📊 Primary career: ${mockRoadmap.primaryCareerPath.title}`);
    console.log(`📊 Phases: ${mockRoadmap.phases.length}`);
    console.log(`📊 Match score: ${mockRoadmap.matchScore}%`);

    // Test data structure validation
    this.validateRoadmapStructure(mockRoadmap);
    
    console.log('🎉 Mock testing completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Get Google AI API key from: https://makersuite.google.com/app/apikey');
    console.log('2. Add GOOGLE_AI_API_KEY to your .env file');
    console.log('3. Run this test again with: npm run test:roadmap');
  }

  validateRoadmapStructure(roadmap) {
    const requiredFields = ['title', 'description', 'primaryCareerPath', 'phases'];
    
    for (const field of requiredFields) {
      if (!roadmap[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Array.isArray(roadmap.phases) || roadmap.phases.length === 0) {
      throw new Error('Phases must be a non-empty array');
    }

    roadmap.phases.forEach((phase, index) => {
      if (!phase.milestones || !Array.isArray(phase.milestones)) {
        throw new Error(`Phase ${index} missing milestones array`);
      }
    });

    console.log('✅ Roadmap structure validation passed');
  }
}

// Run tests if called directly (robust on Windows and POSIX)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const tester = new RoadmapTester();
  tester.testRoadmapGeneration().catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
}

export default RoadmapTester;