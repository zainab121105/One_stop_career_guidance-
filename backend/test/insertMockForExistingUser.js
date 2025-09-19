import mongoose from 'mongoose';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://b23cs130:pan_chocolate_1234@cluster0.j98hbvf.mongodb.net/career_ai?retryWrites=true&w=majority&appName=Cluster0';

async function insertMockForExistingUser() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Find the user by email
  const user = await User.findOne({ email: 'b23cs140@kitsw.ac.in' });
  if (!user) {
    console.error('User not found!');
    await mongoose.disconnect();
    return;
  }

  // Update user with mock skills and badges
  user.profile.currentSkills = [
    { name: 'JavaScript', level: 'intermediate', yearStarted: 2023, certifications: ['JS Basics'], category: 'Programming' },
    { name: 'React', level: 'beginner', yearStarted: 2024, certifications: [], category: 'Frontend' }
  ];
  user.stats.completedCourses = 2;
  user.stats.studyHours = 20;
  user.stats.currentStreak = 3;
  user.stats.totalBadges = user.badges.length + 2;
  user.badges.push(
    { name: 'Skill Master', description: 'Complete 2 courses', icon: 'Medal', earnedAt: new Date('2025-09-19T14:00:00Z'), rarity: 'common', points: 50 },
    { name: 'Consistency King', description: 'Maintain 3-day learning streak', icon: 'Flame', earnedAt: new Date('2025-09-19T15:00:00Z'), rarity: 'epic', points: 100 }
  );
  await user.save();

  // Create mock activities
  const activities = [
    {
      userId: user._id,
      type: 'badge_earned',
      title: "Earned 'Consistency King' badge",
      description: 'Maintained a 3-day learning streak',
      points: 100,
      createdAt: new Date('2025-09-19T15:00:00Z')
    },
    {
      userId: user._id,
      type: 'course_completed',
      title: "Completed 'React Basics'",
      description: 'Finished React Basics course',
      points: 80,
      createdAt: new Date('2025-09-19T14:30:00Z')
    },
    {
      userId: user._id,
      type: 'course_completed',
      title: "Completed 'JavaScript Essentials'",
      description: 'Finished JavaScript Essentials course',
      points: 70,
      createdAt: new Date('2025-09-19T13:30:00Z')
    }
  ];

  await Activity.insertMany(activities);

  console.log('Mock data for existing user inserted!');
  await mongoose.disconnect();
}

insertMockForExistingUser().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
