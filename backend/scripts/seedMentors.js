import mongoose from 'mongoose';
import Mentor from '../models/Mentor.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedMentors = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/careerpath",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    
    console.log('Connected to MongoDB');
    
    // Check if we already have mentors
    const existingMentors = await Mentor.countDocuments();
    if (existingMentors > 0) {
      console.log(`Found ${existingMentors} existing mentors. Skipping seed.`);
      process.exit(0);
    }

    // Create some sample users first (if they don't exist)
    const sampleUsers = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.mentor@example.com',
        password: 'hashed_password_here'
      },
      {
        name: 'Michael Chen',
        email: 'michael.mentor@example.com', 
        password: 'hashed_password_here'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.mentor@example.com',
        password: 'hashed_password_here'
      }
    ];

    // Create users if they don't exist
    const createdUsers = [];
    for (const userData of sampleUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = new User(userData);
        await user.save();
      }
      createdUsers.push(user);
    }

    // Sample mentor data
    const sampleMentors = [
      {
        userId: createdUsers[0]._id,
        name: 'Sarah Johnson',
        title: 'Senior Software Engineer',
        company: 'Google',
        bio: 'Experienced full-stack developer with expertise in React, Node.js, and cloud architecture. Passionate about helping junior developers grow their careers.',
        experience: '5-10 years',
        expertise: ['JavaScript', 'React', 'Node.js', 'AWS', 'System Design'],
        languages: ['English', 'Spanish'],
        location: 'San Francisco, USA',
        availability: 'Available',
        price: {
          amount: 75,
          currency: 'USD'
        },
        rating: {
          average: 4.8,
          count: 24
        },
        totalSessions: 45,
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b2c03b2a?w=400',
        schedule: {
          timezone: 'America/Los_Angeles',
          availableSlots: [
            { day: 'monday', startTime: '09:00', endTime: '17:00' },
            { day: 'wednesday', startTime: '10:00', endTime: '16:00' },
            { day: 'friday', startTime: '09:00', endTime: '15:00' }
          ]
        }
      },
      {
        userId: createdUsers[1]._id,
        name: 'Michael Chen',
        title: 'Data Science Manager',
        company: 'Microsoft',
        bio: 'Data scientist with 8+ years of experience in machine learning, AI, and analytics. Love mentoring aspiring data professionals.',
        experience: '5-10 years',
        expertise: ['Python', 'Machine Learning', 'Data Analytics', 'SQL', 'TensorFlow'],
        languages: ['English', 'Mandarin'],
        location: 'Seattle, USA',
        availability: 'Available',
        price: {
          amount: 80,
          currency: 'USD'
        },
        rating: {
          average: 4.9,
          count: 31
        },
        totalSessions: 67,
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        schedule: {
          timezone: 'America/Los_Angeles',
          availableSlots: [
            { day: 'tuesday', startTime: '14:00', endTime: '18:00' },
            { day: 'thursday', startTime: '10:00', endTime: '16:00' },
            { day: 'saturday', startTime: '09:00', endTime: '13:00' }
          ]
        }
      },
      {
        userId: createdUsers[2]._id,
        name: 'Priya Sharma',
        title: 'Product Manager',
        company: 'Amazon',
        bio: 'Strategic product manager with expertise in e-commerce, user experience, and agile methodologies. Helping professionals transition to product roles.',
        experience: '3-5 years',
        expertise: ['Product Management', 'User Research', 'Agile', 'Strategy', 'Analytics'],
        languages: ['English', 'Hindi'],
        location: 'Bangalore, India',
        availability: 'Available',
        price: {
          amount: 50,
          currency: 'USD'
        },
        rating: {
          average: 4.7,
          count: 18
        },
        totalSessions: 29,
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        schedule: {
          timezone: 'Asia/Kolkata',
          availableSlots: [
            { day: 'monday', startTime: '19:00', endTime: '22:00' },
            { day: 'wednesday', startTime: '19:00', endTime: '22:00' },
            { day: 'sunday', startTime: '10:00', endTime: '14:00' }
          ]
        }
      }
    ];

    // Insert sample mentors
    const insertedMentors = await Mentor.insertMany(sampleMentors);
    console.log(`Successfully inserted ${insertedMentors.length} sample mentors`);
    
    insertedMentors.forEach(mentor => {
      console.log(`- ${mentor.name} (${mentor.title} at ${mentor.company})`);
    });
    
  } catch (error) {
    console.error('Error seeding mentors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

seedMentors();