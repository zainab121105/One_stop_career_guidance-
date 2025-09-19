import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://b23cs130:pan_chocolate_1234@cluster0.j98hbvf.mongodb.net/career_ai?retryWrites=true&w=majority&appName=Cluster0';

async function insertMockData() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Hash password
  const passwordHash = await bcrypt.hash('123456789', 12);

  // Create user
  const user = new User({
    name: 'Test User',
    email: 'example@gmail.com',
    password: passwordHash,
    onboardingCompleted: true,
    onboardingData: {
      currentLevel: 'college',
      careerStage: 'exploring',
      interests: ['technology', 'business'],
      goals: ['career-growth', 'creativity'],
      preferredLearningStyle: 'visual',
      timeCommitment: '3-5-hours'
    },
    profile: {
      avatar: '',
      bio: 'Aspiring developer.',
      location: 'India',
      currentRole: 'Student',
      experience: 'none',
      currentSkills: [
        { name: 'JavaScript', level: 'advanced', yearStarted: 2022, certifications: ['JS Basics'], category: 'Programming' },
        { name: 'React', level: 'intermediate', yearStarted: 2023, certifications: [], category: 'Frontend' },
        { name: 'Node.js', level: 'beginner', yearStarted: 2024, certifications: [], category: 'Backend' }
      ]
    },
    stats: {
      completedCourses: 5,
      totalBadges: 3,
      studyHours: 120,
      currentStreak: 7,
      lastActiveDate: new Date('2025-09-18T10:00:00Z')
    },
    badges: [
      { name: 'Early Bird', description: 'Complete 5 morning study sessions', icon: 'Crown', earnedAt: new Date('2025-09-10T08:00:00Z'), rarity: 'rare', points: 100 },
      { name: 'Consistency King', description: 'Maintain 10-day learning streak', icon: 'Flame', earnedAt: new Date('2025-09-15T08:00:00Z'), rarity: 'epic', points: 200 },
      { name: 'Skill Master', description: 'Complete 5 courses in one category', icon: 'Medal', earnedAt: new Date('2025-09-17T08:00:00Z'), rarity: 'common', points: 50 }
    ]
  });

  await user.save();

  // Create activities
  const activities = [
    {
      userId: user._id,
      type: 'badge_earned',
      title: "Earned 'Consistency King' badge",
      description: 'Maintained a 10-day learning streak',
      points: 200,
      createdAt: new Date('2025-09-15T08:00:00Z')
    },
    {
      userId: user._id,
      type: 'level_up',
      title: 'Reached Level 8',
      description: 'Achieved new level milestone',
      points: 100,
      createdAt: new Date('2025-09-16T08:00:00Z')
    },
    {
      userId: user._id,
      type: 'course_completed',
      title: "Completed 'React Fundamentals'",
      description: 'Finished React course',
      points: 150,
      createdAt: new Date('2025-09-17T08:00:00Z')
    }
  ];

  await Activity.insertMany(activities);

  console.log('Mock user and activities inserted!');
  await mongoose.disconnect();
}

insertMockData().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
